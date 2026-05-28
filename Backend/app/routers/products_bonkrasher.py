# Backend/app/routers/products_bonkrasher.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_bonkrasher import BonkrasherProduct, BonkrasherProductCreate, BonkrasherProductUpdate, BonkrasherProductInDB
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/bonkrasher", tags=["products_bonkrasher"])


# Получить все товары
@router.get("/", response_model=List[BonkrasherProductInDB])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(1000, ge=1, le=10000, description="Максимальное количество записей"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    search: Optional[str] = Query(None, description="Поиск по названию или артикулу"),
    min_price: Optional[float] = Query(None, ge=0, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, ge=0, description="Максимальная цена"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Bonkrasher с фильтрацией"""
    query = db.query(BonkrasherProduct)

    # Фильтр по категории
    if category_id:
        query = query.filter(BonkrasherProduct.category_id == category_id)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(BonkrasherProduct.brand_id == brand_id)

    # Фильтр по цене
    if min_price is not None:
        query = query.filter(BonkrasherProduct.price >= min_price)
    if max_price is not None:
        query = query.filter(BonkrasherProduct.price <= max_price)

    # Поиск по названию или артикулу
    if search:
        query = query.filter(
            or_(
                BonkrasherProduct.name.ilike(f"%{search}%"),
                BonkrasherProduct.sku.ilike(f"%{search}%"),
                BonkrasherProduct.functionality.ilike(f"%{search}%")
            )
        )

    products = query.order_by(BonkrasherProduct.id).offset(skip).limit(limit).all()
    return products


# Получить товар по ID
@router.get("/{product_id}", response_model=BonkrasherProductInDB)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(BonkrasherProduct).filter(BonkrasherProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Bonkrasher не найден")
    return product


# Получить товар по артикулу (SKU)
@router.get("/sku/{sku}", response_model=Optional[BonkrasherProductInDB])
def get_product_by_sku(
    sku: str,
    db: Session = Depends(get_db)
):
    """Получить товар по артикулу (SKU)"""
    product = db.query(BonkrasherProduct).filter(BonkrasherProduct.sku == sku).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с артикулом {sku} не найден")
    return product


# Поиск товаров по названию
@router.get("/search/{name}", response_model=List[BonkrasherProductInDB])
def search_products_by_name(
    name: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Поиск товаров по названию (частичное совпадение)"""
    products = db.query(BonkrasherProduct).filter(
        BonkrasherProduct.name.ilike(f"%{name}%")
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары с названием содержащим '{name}' не найдены")
    return products


# Создать товар (только для админа)
@router.post("/", response_model=BonkrasherProductInDB, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: BonkrasherProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар Bonkrasher (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка уникальности артикула (если указан)
    if product_data.sku:
        existing = db.query(BonkrasherProduct).filter(
            BonkrasherProduct.sku == product_data.sku
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")

    # Проверка уникальности названия (опционально)
    existing_by_name = db.query(BonkrasherProduct).filter(
        BonkrasherProduct.name == product_data.name
    ).first()
    if existing_by_name:
        raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    product = BonkrasherProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар полностью (только для админа)
@router.put("/{product_id}", response_model=BonkrasherProductInDB)
def update_product(
    product_id: int,
    product_data: BonkrasherProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(BonkrasherProduct).filter(BonkrasherProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Bonkrasher не найден")

    # Если обновляется артикул, проверяем уникальность
    if product_data.sku and product_data.sku != product.sku:
        existing = db.query(BonkrasherProduct).filter(
            BonkrasherProduct.sku == product_data.sku
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing_by_name = db.query(BonkrasherProduct).filter(
            BonkrasherProduct.name == product_data.name
        ).first()
        if existing_by_name:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара (только для админа)
@router.patch("/{product_id}", response_model=BonkrasherProductInDB)
def partial_update_product(
    product_id: int,
    product_data: BonkrasherProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(BonkrasherProduct).filter(BonkrasherProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Bonkrasher не найден")

    # Если обновляется артикул, проверяем уникальность
    if product_data.sku and product_data.sku != product.sku:
        existing = db.query(BonkrasherProduct).filter(
            BonkrasherProduct.sku == product_data.sku
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом уже существует")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing_by_name = db.query(BonkrasherProduct).filter(
            BonkrasherProduct.name == product_data.name
        ).first()
        if existing_by_name:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

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
    """Удалить товар Bonkrasher (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(BonkrasherProduct).filter(BonkrasherProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Bonkrasher не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам Bonkrasher (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(BonkrasherProduct).count()
    with_price = db.query(BonkrasherProduct).filter(BonkrasherProduct.price > 0).count()
    with_image = db.query(BonkrasherProduct).filter(
        BonkrasherProduct.main_image.isnot(None)
    ).count()
    with_sku = db.query(BonkrasherProduct).filter(
        BonkrasherProduct.sku.isnot(None)
    ).count()
    with_functionality = db.query(BonkrasherProduct).filter(
        BonkrasherProduct.functionality.isnot(None)
    ).count()

    # Статистика по категориям
    category_stats = db.query(
        BonkrasherProduct.category_id,
        db.func.count(BonkrasherProduct.id)
    ).filter(BonkrasherProduct.category_id.isnot(None)).group_by(
        BonkrasherProduct.category_id
    ).order_by(db.func.count(BonkrasherProduct.id).desc()).limit(10).all()

    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_image": with_image,
        "without_image": total - with_image,
        "with_sku": with_sku,
        "without_sku": total - with_sku,
        "with_functionality": with_functionality,
        "without_functionality": total - with_functionality,
        "top_categories": [{"category_id": c, "count": cnt} for c, cnt in category_stats]
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    price_range = db.query(
        db.func.min(BonkrasherProduct.price),
        db.func.max(BonkrasherProduct.price)
    ).filter(BonkrasherProduct.price > 0).first()

    categories = db.query(
        BonkrasherProduct.category_id,
        db.func.count(BonkrasherProduct.id)
    ).filter(BonkrasherProduct.category_id.isnot(None)).group_by(
        BonkrasherProduct.category_id
    ).order_by(BonkrasherProduct.category_id).all()

    return {
        "min_price": float(price_range[0]) if price_range and price_range[0] else 0,
        "max_price": float(price_range[1]) if price_range and price_range[1] else 0,
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

    deleted_count = db.query(BonkrasherProduct).filter(
        BonkrasherProduct.id.in_(product_ids)
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

    products = db.query(BonkrasherProduct).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Заголовки
    writer.writerow(["ID", "Артикул", "Наименование", "Цена", "Функционал", "Категория"])

    # Данные
    for p in products:
        writer.writerow([
            p.id, p.sku, p.name, p.price,
            p.functionality[:200] if p.functionality else "",
            p.category_id
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=bonkrasher_products.csv"}
    )