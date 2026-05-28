from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from ..database import get_db
from ..models.product_kuppersbusch import KuppersbuschProduct
from ..models.schemas import (
    KuppersbuschProductCreate,
    KuppersbuschProductUpdate,
    KuppersbuschProductInDB
)
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/kuppersbusch", tags=["products_kuppersbusch"])


# Получить все товары
@router.get("/", response_model=List[KuppersbuschProductInDB])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(1000, ge=1, le=50000, description="Максимальное количество записей"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    search: Optional[str] = Query(None, description="Поиск по названию или артикулу"),
    min_price: Optional[float] = Query(None, ge=0, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, ge=0, description="Максимальная цена"),
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    series: Optional[str] = Query(None, description="Фильтр по серии"),
    color: Optional[str] = Query(None, description="Фильтр по цвету"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Kuppersbusch с фильтрацией"""
    query = db.query(KuppersbuschProduct)

    # Фильтр по категории
    if category_id:
        query = query.filter(KuppersbuschProduct.category_id == category_id)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(KuppersbuschProduct.brand_id == brand_id)

    # Фильтр по статусу
    if status:
        query = query.filter(KuppersbuschProduct.status == status)

    # Фильтр по серии
    if series:
        query = query.filter(KuppersbuschProduct.series == series)

    # Фильтр по цвету
    if color:
        query = query.filter(KuppersbuschProduct.color == color)

    # Фильтр по цене
    if min_price is not None:
        query = query.filter(KuppersbuschProduct.price >= min_price)
    if max_price is not None:
        query = query.filter(KuppersbuschProduct.price <= max_price)

    # Поиск по названию или артикулу
    if search:
        query = query.filter(
            or_(
                KuppersbuschProduct.name.ilike(f"%{search}%"),
                KuppersbuschProduct.sku.ilike(f"%{search}%"),
                KuppersbuschProduct.series.ilike(f"%{search}%")
            )
        )

    products = query.order_by(KuppersbuschProduct.id).offset(skip).limit(limit).all()
    return products


# Получить товар по ID
@router.get("/{product_id}", response_model=KuppersbuschProductInDB)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(KuppersbuschProduct).filter(KuppersbuschProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Kuppersbusch не найден")
    return product


# Получить товар по артикулу (SKU)
@router.get("/sku/{sku}", response_model=Optional[KuppersbuschProductInDB])
def get_product_by_sku(
    sku: str,
    db: Session = Depends(get_db)
):
    """Получить товар по артикулу (SKU)"""
    product = db.query(KuppersbuschProduct).filter(KuppersbuschProduct.sku == sku).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с артикулом {sku} не найден")
    return product


# Получить товары по серии
@router.get("/series/{series}", response_model=List[KuppersbuschProductInDB])
def get_products_by_series(
    series: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по серии"""
    products = db.query(KuppersbuschProduct).filter(
        KuppersbuschProduct.series.ilike(f"%{series}%")
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары серии {series} не найдены")
    return products


# Получить товары по статусу
@router.get("/status/{status}", response_model=List[KuppersbuschProductInDB])
def get_products_by_status(
    status: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по статусу (Outlet, Акция, Новинка и т.д.)"""
    products = db.query(KuppersbuschProduct).filter(
        KuppersbuschProduct.status == status
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары со статусом {status} не найдены")
    return products


# Создать товар (только для админа)
@router.post("/", response_model=KuppersbuschProductInDB, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: KuppersbuschProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар Kuppersbusch (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка уникальности SKU (если указан)
    if product_data.sku:
        existing = db.query(KuppersbuschProduct).filter(
            KuppersbuschProduct.sku == product_data.sku
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом (SKU) уже существует")

    product = KuppersbuschProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар полностью (только для админа)
@router.put("/{product_id}", response_model=KuppersbuschProductInDB)
def update_product(
    product_id: int,
    product_data: KuppersbuschProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(KuppersbuschProduct).filter(KuppersbuschProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Kuppersbusch не найден")

    # Если обновляется SKU, проверяем уникальность
    if product_data.sku and product_data.sku != product.sku:
        existing = db.query(KuppersbuschProduct).filter(
            KuppersbuschProduct.sku == product_data.sku
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом (SKU) уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара (только для админа)
@router.patch("/{product_id}", response_model=KuppersbuschProductInDB)
def partial_update_product(
    product_id: int,
    product_data: KuppersbuschProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(KuppersbuschProduct).filter(KuppersbuschProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Kuppersbusch не найден")

    # Если обновляется SKU, проверяем уникальность
    if product_data.sku and product_data.sku != product.sku:
        existing = db.query(KuppersbuschProduct).filter(
            KuppersbuschProduct.sku == product_data.sku
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким артикулом (SKU) уже существует")

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
    """Удалить товар Kuppersbusch (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(KuppersbuschProduct).filter(KuppersbuschProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Kuppersbusch не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам Kuppersbusch (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(KuppersbuschProduct).count()
    with_price = db.query(KuppersbuschProduct).filter(KuppersbuschProduct.price > 0).count()
    with_image = db.query(KuppersbuschProduct).filter(
        KuppersbuschProduct.main_image.isnot(None)
    ).count()
    with_sku = db.query(KuppersbuschProduct).filter(
        KuppersbuschProduct.sku.isnot(None)
    ).count()

    # Статистика по статусам
    status_stats = db.query(
        KuppersbuschProduct.status,
        db.func.count(KuppersbuschProduct.id)
    ).filter(KuppersbuschProduct.status.isnot(None)).group_by(KuppersbuschProduct.status).all()

    # Статистика по сериям (топ 10)
    series_stats = db.query(
        KuppersbuschProduct.series,
        db.func.count(KuppersbuschProduct.id)
    ).filter(KuppersbuschProduct.series.isnot(None)).group_by(
        KuppersbuschProduct.series
    ).order_by(db.func.count(KuppersbuschProduct.id).desc()).limit(10).all()

    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_image": with_image,
        "without_image": total - with_image,
        "with_sku": with_sku,
        "without_sku": total - with_sku,
        "status_distribution": [{"status": s, "count": c} for s, c in status_stats],
        "top_series": [{"series": s, "count": c} for s, c in series_stats]
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    statuses = db.query(KuppersbuschProduct.status).filter(
        KuppersbuschProduct.status.isnot(None)
    ).distinct().all()

    series_list = db.query(KuppersbuschProduct.series).filter(
        KuppersbuschProduct.series.isnot(None)
    ).distinct().all()

    colors = db.query(KuppersbuschProduct.color).filter(
        KuppersbuschProduct.color.isnot(None)
    ).distinct().all()

    price_range = db.query(
        db.func.min(KuppersbuschProduct.price),
        db.func.max(KuppersbuschProduct.price)
    ).filter(KuppersbuschProduct.price > 0).first()

    return {
        "statuses": [s[0] for s in statuses if s[0]],
        "series": [s[0] for s in series_list if s[0]],
        "colors": [c[0] for c in colors if c[0]],
        "min_price": float(price_range[0]) if price_range and price_range[0] else 0,
        "max_price": float(price_range[1]) if price_range and price_range[1] else 0
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

    deleted_count = db.query(KuppersbuschProduct).filter(
        KuppersbuschProduct.id.in_(product_ids)
    ).delete(synchronize_session=False)

    db.commit()

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Товары не найдены")

    return None  # 204 No Content