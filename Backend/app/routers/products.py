# Backend/app/routers/products_common.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from ..database import get_db
from ..models import Product, Brand, Category
from ..models.schemas import ProductCreate, ProductUpdate, ProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products", tags=["products"])


# Получить все товары
@router.get("/", response_model=List[ProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(100, ge=1, le=500, description="Максимальное количество записей"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    search: Optional[str] = Query(None, description="Поиск по названию или артикулу"),
    min_price: Optional[float] = Query(None, ge=0, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, ge=0, description="Максимальная цена"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров с фильтрацией"""
    query = db.query(Product)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)

    # Фильтр по категории
    if category_id:
        query = query.filter(Product.category_id == category_id)

    # Фильтр по цене
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # Поиск по названию или артикулу
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%")
            )
        )

    products = query.order_by(Product.id).offset(skip).limit(limit).all()
    return products


# Получить товар по ID
@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product


# Получить товар по артикулу (SKU)
@router.get("/sku/{sku}", response_model=Optional[ProductResponse])
def get_product_by_sku(
    sku: str,
    db: Session = Depends(get_db)
):
    """Получить товар по артикулу (SKU)"""
    product = db.query(Product).filter(Product.sku == sku).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с артикулом {sku} не найден")
    return product


# Получить товары по бренду
@router.get("/brand/{brand_id}", response_model=List[ProductResponse])
def get_products_by_brand(
    brand_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Получить все товары определенного бренда"""
    # Проверяем существование бренда
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Бренд не найден")

    products = db.query(Product).filter(
        Product.brand_id == brand_id
    ).offset(skip).limit(limit).all()

    return products


# Получить товары по категории
@router.get("/category/{category_id}", response_model=List[ProductResponse])
def get_products_by_category(
    category_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Получить все товары определенной категории"""
    products = db.query(Product).filter(
        Product.category_id == category_id
    ).offset(skip).limit(limit).all()

    return products


# Создать товар (только для админа)
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка существования бренда
    brand = db.query(Brand).filter(Brand.id == product_data.brand_id).first()
    if not brand:
        raise HTTPException(status_code=400, detail="Бренд не найден")

    # Проверка существования категории (если указана)
    if product_data.category_id:
        category = db.query(Category).filter(Category.id == product_data.category_id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Категория не найдена")

    # Проверка уникальности SKU (если указан)
    if product_data.sku:
        existing = db.query(Product).filter(Product.sku == product_data.sku).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")

    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар полностью (только для админа)
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Проверка существования бренда
    if product_data.brand_id:
        brand = db.query(Brand).filter(Brand.id == product_data.brand_id).first()
        if not brand:
            raise HTTPException(status_code=400, detail="Бренд не найден")

    # Проверка уникальности SKU
    if product_data.sku and product_data.sku != product.sku:
        existing = db.query(Product).filter(Product.sku == product_data.sku).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара (только для админа)
@router.patch("/{product_id}", response_model=ProductResponse)
def partial_update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Проверка уникальности SKU
    if product_data.sku and product_data.sku != product.sku:
        existing = db.query(Product).filter(Product.sku == product_data.sku).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")

    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Удалить товар (только для админа)
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(Product).count()
    with_price = db.query(Product).filter(Product.price > 0).count()
    with_image = db.query(Product).filter(Product.main_image.isnot(None)).count()
    with_sku = db.query(Product).filter(Product.sku.isnot(None)).count()
    with_attributes = db.query(Product).filter(Product.attributes.isnot(None)).count()

    # Статистика по брендам
    brand_stats = db.query(
        Product.brand_id,
        db.func.count(Product.id)
    ).group_by(Product.brand_id).order_by(db.func.count(Product.id).desc()).limit(10).all()

    # Статистика по категориям
    category_stats = db.query(
        Product.category_id,
        db.func.count(Product.id)
    ).filter(Product.category_id.isnot(None)).group_by(
        Product.category_id
    ).order_by(db.func.count(Product.id).desc()).limit(10).all()

    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_image": with_image,
        "without_image": total - with_image,
        "with_sku": with_sku,
        "without_sku": total - with_sku,
        "with_attributes": with_attributes,
        "without_attributes": total - with_attributes,
        "top_brands": [{"brand_id": b, "count": c} for b, c in brand_stats],
        "top_categories": [{"category_id": c, "count": cnt} for c, cnt in category_stats if c is not None]
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    price_range = db.query(
        db.func.min(Product.price),
        db.func.max(Product.price)
    ).filter(Product.price > 0).first()

    brands = db.query(
        Product.brand_id,
        db.func.count(Product.id)
    ).group_by(Product.brand_id).order_by(Product.brand_id).all()

    categories = db.query(
        Product.category_id,
        db.func.count(Product.id)
    ).filter(Product.category_id.isnot(None)).group_by(
        Product.category_id
    ).order_by(Product.category_id).all()

    return {
        "min_price": float(price_range[0]) if price_range and price_range[0] else 0,
        "max_price": float(price_range[1]) if price_range and price_range[1] else 0,
        "brands": [{"id": b[0], "count": b[1]} for b in brands],
        "categories": [{"id": c[0], "count": c[1]} for c in categories]
    }


# Массовое удаление товаров (только для админа)
@router.delete("/bulk/delete", status_code=status.HTTP_204_NO_CONTENT)
def bulk_delete_products(
    product_ids: List[int],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Массовое удаление товаров по списку ID (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    deleted_count = db.query(Product).filter(
        Product.id.in_(product_ids)
    ).delete(synchronize_session=False)

    db.commit()

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Товары не найдены")

    return None


# Экспорт товаров в CSV (только для админа)
@router.get("/export/csv")
def export_products_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Экспорт товаров в CSV формат (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    import csv
    from fastapi.responses import StreamingResponse
    import io

    products = db.query(Product).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Заголовки
    writer.writerow(["ID", "Название", "Артикул", "Цена", "Бренд ID", "Категория ID"])

    # Данные
    for p in products:
        writer.writerow([
            p.id, p.name, p.sku, p.price, p.brand_id, p.category_id
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=products.csv"}
    )