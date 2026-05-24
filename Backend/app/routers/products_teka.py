# Backend/app/routers/products_teka.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_teka import TekaProduct, TekaProductCreate, TekaProductUpdate, TekaProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/teka", tags=["products_teka"])


# Получить все товары
@router.get("/", response_model=List[TekaProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(100, ge=1, le=500, description="Максимальное количество записей"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    search: Optional[str] = Query(None, description="Поиск по названию"),
    min_price: Optional[float] = Query(None, ge=0, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, ge=0, description="Максимальная цена"),
    min_dmd: Optional[int] = Query(None, ge=0, description="Минимальное количество DMD"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Teka с фильтрацией"""
    query = db.query(TekaProduct)

    # Фильтр по категории
    if category_id:
        query = query.filter(TekaProduct.category_id == category_id)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(TekaProduct.brand_id == brand_id)

    # Фильтр по цене
    if min_price is not None:
        query = query.filter(TekaProduct.price >= min_price)
    if max_price is not None:
        query = query.filter(TekaProduct.price <= max_price)

    # Фильтр по DMD
    if min_dmd is not None:
        query = query.filter(TekaProduct.dmd_quantity >= min_dmd)

    # Поиск по названию
    if search:
        query = query.filter(
            or_(
                TekaProduct.name.ilike(f"%{search}%"),
            )
        )

    products = query.order_by(TekaProduct.id).offset(skip).limit(limit).all()
    return products


# Получить товар по ID
@router.get("/{product_id}", response_model=TekaProductResponse)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")
    return product


# Получить товар по названию
@router.get("/name/{name}", response_model=Optional[TekaProductResponse])
def get_product_by_name(
    name: str,
    db: Session = Depends(get_db)
):
    """Получить товар по точному названию"""
    product = db.query(TekaProduct).filter(TekaProduct.name == name).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с названием '{name}' не найден")
    return product


# Поиск товаров по названию (частичное совпадение)
@router.get("/search/{query}", response_model=List[TekaProductResponse])
def search_products_by_name(
    query: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Поиск товаров по названию (частичное совпадение)"""
    products = db.query(TekaProduct).filter(
        TekaProduct.name.ilike(f"%{query}%")
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары с названием содержащим '{query}' не найдены")
    return products


# Создать товар (только для админа)
@router.post("/", response_model=TekaProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: TekaProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар Teka (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка уникальности названия
    existing = db.query(TekaProduct).filter(
        TekaProduct.name == product_data.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    product = TekaProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар полностью (только для админа)
@router.put("/{product_id}", response_model=TekaProductResponse)
def update_product(
    product_id: int,
    product_data: TekaProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing = db.query(TekaProduct).filter(
            TekaProduct.name == product_data.name
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара (только для админа)
@router.patch("/{product_id}", response_model=TekaProductResponse)
def partial_update_product(
    product_id: int,
    product_data: TekaProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing = db.query(TekaProduct).filter(
            TekaProduct.name == product_data.name
        ).first()
        if existing:
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
    """Удалить товар Teka (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам Teka (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(TekaProduct).count()
    with_price = db.query(TekaProduct).filter(TekaProduct.price > 0).count()
    with_dmd = db.query(TekaProduct).filter(TekaProduct.dmd_quantity.isnot(None)).count()
    with_dmd_perup = db.query(TekaProduct).filter(TekaProduct.dmd_perup_quantity.isnot(None)).count()

    # Статистика по категориям
    category_stats = db.query(
        TekaProduct.category_id,
        db.func.count(TekaProduct.id)
    ).filter(TekaProduct.category_id.isnot(None)).group_by(
        TekaProduct.category_id
    ).order_by(db.func.count(TekaProduct.id).desc()).limit(10).all()

    # Суммарная статистика по DMD
    total_dmd = db.query(db.func.sum(TekaProduct.dmd_quantity)).scalar() or 0
    total_dmd_perup = db.query(db.func.sum(TekaProduct.dmd_perup_quantity)).scalar() or 0

    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_dmd": with_dmd,
        "without_dmd": total - with_dmd,
        "with_dmd_perup": with_dmd_perup,
        "total_dmd_quantity": int(total_dmd),
        "total_dmd_perup_quantity": int(total_dmd_perup),
        "top_categories": [{"category_id": c, "count": cnt} for c, cnt in category_stats]
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    price_range = db.query(
        db.func.min(TekaProduct.price),
        db.func.max(TekaProduct.price)
    ).filter(TekaProduct.price > 0).first()

    categories = db.query(
        TekaProduct.category_id,
        db.func.count(TekaProduct.id)
    ).filter(TekaProduct.category_id.isnot(None)).group_by(
        TekaProduct.category_id
    ).order_by(TekaProduct.category_id).all()

    dmd_range = db.query(
        db.func.min(TekaProduct.dmd_quantity),
        db.func.max(TekaProduct.dmd_quantity)
    ).filter(TekaProduct.dmd_quantity.isnot(None)).first()

    return {
        "min_price": float(price_range[0]) if price_range and price_range[0] else 0,
        "max_price": float(price_range[1]) if price_range and price_range[1] else 0,
        "min_dmd": int(dmd_range[0]) if dmd_range and dmd_range[0] else 0,
        "max_dmd": int(dmd_range[1]) if dmd_range and dmd_range[1] else 0,
        "categories": [{"id": c[0], "count": c[1]} for c in categories if c[0] is not None]
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

    deleted_count = db.query(TekaProduct).filter(
        TekaProduct.id.in_(product_ids)
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

    products = db.query(TekaProduct).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Заголовки
    writer.writerow(["ID", "Название", "Цена", "DMD кол-во", "DMD_PERUP кол-во", "Категория"])

    # Данные
    for p in products:
        writer.writerow([
            p.id, p.name, p.price, p.dmd_quantity, p.dmd_perup_quantity, p.category_id
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=teka_products.csv"}
    )


# Обновить DMD количество (только для админа)
@router.patch("/{product_id}/dmd", response_model=TekaProductResponse)
def update_dmd_quantity(
    product_id: int,
    dmd_quantity: int = Query(..., ge=0, description="Новое количество DMD"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить количество DMD для товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")

    product.dmd_quantity = dmd_quantity
    db.commit()
    db.refresh(product)
    return product