# Backend/app/routers/products_ilve.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_ilve import IlveProduct
from ..models.schemas import IlveProductCreate, IlveProductUpdate, IlveProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/ilve", tags=["products_ilve"])


# Получить все товары Ilve
@router.get("/", response_model=List[IlveProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(100, ge=1, le=500, description="Максимальное количество записей"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    search: Optional[str] = Query(None, description="Поиск по названию, модели или SKU"),
    group: Optional[str] = Query(None, description="Фильтр по группе"),
    series: Optional[str] = Query(None, description="Фильтр по серии"),
    color: Optional[str] = Query(None, description="Фильтр по цвету"),
    min_price: Optional[float] = Query(None, ge=0, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, ge=0, description="Максимальная цена"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Ilve с фильтрацией"""
    query = db.query(IlveProduct)

    # Фильтр по категории
    if category_id:
        query = query.filter(IlveProduct.category_id == category_id)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(IlveProduct.brand_id == brand_id)

    # Фильтр по группе
    if group:
        query = query.filter(IlveProduct.group == group)

    # Фильтр по серии
    if series:
        query = query.filter(IlveProduct.series == series)

    # Фильтр по цвету
    if color:
        query = query.filter(IlveProduct.color == color)

    # Фильтр по цене
    if min_price is not None:
        query = query.filter(IlveProduct.price >= min_price)
    if max_price is not None:
        query = query.filter(IlveProduct.price <= max_price)

    # Поиск по названию, модели или SKU
    if search:
        query = query.filter(
            or_(
                IlveProduct.name.ilike(f"%{search}%"),
                IlveProduct.model.ilike(f"%{search}%"),
                IlveProduct.sku.ilike(f"%{search}%"),
                IlveProduct.series.ilike(f"%{search}%")
            )
        )

    products = query.order_by(IlveProduct.id).offset(skip).limit(limit).all()
    return products


# Получить товар Ilve по ID
@router.get("/{product_id}", response_model=IlveProductResponse)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(IlveProduct).filter(IlveProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Ilve не найден")
    return product


# Получить товар Ilve по названию
@router.get("/name/{name}", response_model=Optional[IlveProductResponse])
def get_product_by_name(
    name: str,
    db: Session = Depends(get_db)
):
    """Получить товар по точному названию"""
    product = db.query(IlveProduct).filter(IlveProduct.name == name).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с названием '{name}' не найден")
    return product


# Получить товар Ilve по SKU
@router.get("/sku/{sku}", response_model=Optional[IlveProductResponse])
def get_product_by_sku(
    sku: str,
    db: Session = Depends(get_db)
):
    """Получить товар по SKU (артикулу)"""
    product = db.query(IlveProduct).filter(IlveProduct.sku == sku).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с SKU '{sku}' не найден")
    return product


# Получить товар Ilve по EAN
@router.get("/ean/{ean}", response_model=Optional[IlveProductResponse])
def get_product_by_ean(
    ean: str,
    db: Session = Depends(get_db)
):
    """Получить товар по EAN (штрих-коду)"""
    product = db.query(IlveProduct).filter(IlveProduct.ean == ean).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с EAN '{ean}' не найден")
    return product


# Получить товары Ilve по модели
@router.get("/model/{model}", response_model=List[IlveProductResponse])
def get_products_by_model(
    model: str,
    db: Session = Depends(get_db)
):
    """Получить товары по модели"""
    products = db.query(IlveProduct).filter(IlveProduct.model == model).all()
    if not products:
        raise HTTPException(status_code=404, detail="Товары с такой моделью не найдены")
    return products


# Получить товары Ilve по серии
@router.get("/series/{series}", response_model=List[IlveProductResponse])
def get_products_by_series(
    series: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по серии"""
    products = db.query(IlveProduct).filter(
        IlveProduct.series.ilike(f"%{series}%")
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары серии '{series}' не найдены")
    return products


# Получить товары Ilve по группе
@router.get("/group/{group}", response_model=List[IlveProductResponse])
def get_products_by_group(
    group: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по группе"""
    products = db.query(IlveProduct).filter(
        IlveProduct.group == group
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары группы '{group}' не найдены")
    return products


# Создать товар Ilve (только для админа)
@router.post("/", response_model=IlveProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: IlveProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар Ilve (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка уникальности названия
    existing = db.query(IlveProduct).filter(IlveProduct.name == product_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    # Проверка уникальности SKU (если указан)
    if product_data.sku:
        existing_sku = db.query(IlveProduct).filter(IlveProduct.sku == product_data.sku).first()
        if existing_sku:
            raise HTTPException(status_code=400, detail="Товар с таким SKU уже существует")

    product = IlveProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар Ilve (только для админа)
@router.put("/{product_id}", response_model=IlveProductResponse)
def update_product(
    product_id: int,
    product_data: IlveProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(IlveProduct).filter(IlveProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Ilve не найден")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing = db.query(IlveProduct).filter(IlveProduct.name == product_data.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    # Если обновляется SKU, проверяем уникальность
    if product_data.sku and product_data.sku != product.sku:
        existing_sku = db.query(IlveProduct).filter(IlveProduct.sku == product_data.sku).first()
        if existing_sku:
            raise HTTPException(status_code=400, detail="Товар с таким SKU уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара Ilve (только для админа)
@router.patch("/{product_id}", response_model=IlveProductResponse)
def partial_update_product(
    product_id: int,
    product_data: IlveProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(IlveProduct).filter(IlveProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Ilve не найден")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing = db.query(IlveProduct).filter(IlveProduct.name == product_data.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    # Если обновляется SKU, проверяем уникальность
    if product_data.sku and product_data.sku != product.sku:
        existing_sku = db.query(IlveProduct).filter(IlveProduct.sku == product_data.sku).first()
        if existing_sku:
            raise HTTPException(status_code=400, detail="Товар с таким SKU уже существует")

    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Удалить товар Ilve (только для админа)
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить товар Ilve (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(IlveProduct).filter(IlveProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Ilve не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам Ilve (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(IlveProduct).count()
    with_price = db.query(IlveProduct).filter(IlveProduct.price > 0).count()
    with_image = db.query(IlveProduct).filter(IlveProduct.main_image.isnot(None)).count()
    with_sku = db.query(IlveProduct).filter(IlveProduct.sku.isnot(None)).count()
    with_ean = db.query(IlveProduct).filter(IlveProduct.ean.isnot(None)).count()

    # Статистика по группам
    group_stats = db.query(
        IlveProduct.group,
        db.func.count(IlveProduct.id)
    ).filter(IlveProduct.group.isnot(None)).group_by(
        IlveProduct.group
    ).order_by(db.func.count(IlveProduct.id).desc()).limit(10).all()

    # Статистика по сериям
    series_stats = db.query(
        IlveProduct.series,
        db.func.count(IlveProduct.id)
    ).filter(IlveProduct.series.isnot(None)).group_by(
        IlveProduct.series
    ).order_by(db.func.count(IlveProduct.id).desc()).limit(10).all()

    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_image": with_image,
        "without_image": total - with_image,
        "with_sku": with_sku,
        "without_sku": total - with_sku,
        "with_ean": with_ean,
        "without_ean": total - with_ean,
        "top_groups": [{"group": g, "count": c} for g, c in group_stats],
        "top_series": [{"series": s, "count": c} for s, c in series_stats]
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    groups = db.query(IlveProduct.group).filter(
        IlveProduct.group.isnot(None)
    ).distinct().all()

    series_list = db.query(IlveProduct.series).filter(
        IlveProduct.series.isnot(None)
    ).distinct().all()

    colors = db.query(IlveProduct.color).filter(
        IlveProduct.color.isnot(None)
    ).distinct().all()

    price_range = db.query(
        db.func.min(IlveProduct.price),
        db.func.max(IlveProduct.price)
    ).filter(IlveProduct.price > 0).first()

    return {
        "groups": [g[0] for g in groups if g[0]],
        "series": [s[0] for s in series_list if s[0]],
        "colors": [c[0] for c in colors if c[0]],
        "min_price": float(price_range[0]) if price_range and price_range[0] else 0,
        "max_price": float(price_range[1]) if price_range and price_range[1] else 0
    }


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

    products = db.query(IlveProduct).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Заголовки
    writer.writerow([
        "ID", "SKU", "Модель", "Название", "Серия", "Группа",
        "Цвет", "Декор", "Ширина", "Цена", "Статус", "EAN"
    ])

    # Данные
    for p in products:
        writer.writerow([
            p.id, p.sku, p.model, p.name, p.series, p.group,
            p.color, p.decor_color, p.width, p.price, p.status, p.ean
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ilve_products.csv"}
    )