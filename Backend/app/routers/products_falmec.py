# Backend/app/routers/products_falmec.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from ..database import get_db
from ..models.product_falmec import FalmecProduct, FalmecProductCreate, FalmecProductUpdate, FalmecProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/falmec", tags=["products_falmec"])


# Получить все товары
@router.get("/", response_model=List[FalmecProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(1000, ge=1, le=5000, description="Максимальное количество записей"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    search: Optional[str] = Query(None, description="Поиск по модели или коду производителя"),
    mounting_type: Optional[str] = Query(None, description="Фильтр по типу монтажа"),
    color: Optional[str] = Query(None, description="Фильтр по цвету"),
    min_width: Optional[float] = Query(None, ge=0, description="Минимальная ширина, см"),
    max_width: Optional[float] = Query(None, ge=0, description="Максимальная ширина, см"),
    min_performance: Optional[int] = Query(None, ge=0, description="Минимальная производительность, м3/час"),
    max_performance: Optional[int] = Query(None, ge=0, description="Максимальная производительность, м3/час"),
    min_price: Optional[float] = Query(None, ge=0, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, ge=0, description="Максимальная цена"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Falmec с фильтрацией"""
    query = db.query(FalmecProduct)

    # Фильтр по категории
    if category_id:
        query = query.filter(FalmecProduct.category_id == category_id)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(FalmecProduct.brand_id == brand_id)

    # Фильтр по типу монтажа
    if mounting_type:
        query = query.filter(FalmecProduct.mounting_type == mounting_type)

    # Фильтр по цвету
    if color:
        query = query.filter(FalmecProduct.color == color)

    # Фильтр по ширине
    if min_width is not None:
        query = query.filter(FalmecProduct.width_cm >= min_width)
    if max_width is not None:
        query = query.filter(FalmecProduct.width_cm <= max_width)

    # Фильтр по производительности
    if min_performance is not None:
        query = query.filter(FalmecProduct.performance_m3h >= min_performance)
    if max_performance is not None:
        query = query.filter(FalmecProduct.performance_m3h <= max_performance)

    # Фильтр по цене
    if min_price is not None:
        query = query.filter(FalmecProduct.price_retail >= min_price)
    if max_price is not None:
        query = query.filter(FalmecProduct.price_retail <= max_price)

    # Поиск по модели или коду производителя
    if search:
        query = query.filter(
            or_(
                FalmecProduct.model.ilike(f"%{search}%"),
                FalmecProduct.manufacturer_code.ilike(f"%{search}%"),
                FalmecProduct.supply_program.ilike(f"%{search}%")
            )
        )

    products = query.order_by(FalmecProduct.id).offset(skip).limit(limit).all()
    return products


# Получить товар по ID
@router.get("/{product_id}", response_model=FalmecProductResponse)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(FalmecProduct).filter(FalmecProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Falmec не найден")
    return product


# Получить товар по модели
@router.get("/model/{model}", response_model=Optional[FalmecProductResponse])
def get_product_by_model(
    model: str,
    db: Session = Depends(get_db)
):
    """Получить товар по модели (точное совпадение)"""
    product = db.query(FalmecProduct).filter(FalmecProduct.model == model).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с моделью '{model}' не найден")
    return product


# Получить товар по коду производителя
@router.get("/code/{manufacturer_code}", response_model=Optional[FalmecProductResponse])
def get_product_by_manufacturer_code(
    manufacturer_code: str,
    db: Session = Depends(get_db)
):
    """Получить товар по коду производителя"""
    product = db.query(FalmecProduct).filter(
        FalmecProduct.manufacturer_code == manufacturer_code
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с кодом '{manufacturer_code}' не найден")
    return product


# Поиск товаров по модели (частичное совпадение)
@router.get("/search/{query}", response_model=List[FalmecProductResponse])
def search_products_by_model(
    query: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Поиск товаров по модели (частичное совпадение)"""
    products = db.query(FalmecProduct).filter(
        or_(
            FalmecProduct.model.ilike(f"%{query}%"),
            FalmecProduct.manufacturer_code.ilike(f"%{query}%")
        )
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары с моделью содержащей '{query}' не найдены")
    return products


# Получить товары по типу монтажа
@router.get("/mounting/{mounting_type}", response_model=List[FalmecProductResponse])
def get_products_by_mounting_type(
    mounting_type: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по типу монтажа"""
    products = db.query(FalmecProduct).filter(
        FalmecProduct.mounting_type == mounting_type
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары с типом монтажа '{mounting_type}' не найдены")
    return products


# Получить товары по цвету
@router.get("/color/{color}", response_model=List[FalmecProductResponse])
def get_products_by_color(
    color: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по цвету"""
    products = db.query(FalmecProduct).filter(
        FalmecProduct.color == color
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары цвета '{color}' не найдены")
    return products


# Создать товар (только для админа)
@router.post("/", response_model=FalmecProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: FalmecProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар Falmec (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка уникальности модели (если указана)
    if product_data.model:
        existing = db.query(FalmecProduct).filter(
            FalmecProduct.model == product_data.model
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

    # Проверка уникальности кода производителя (если указан)
    if product_data.manufacturer_code:
        existing = db.query(FalmecProduct).filter(
            FalmecProduct.manufacturer_code == product_data.manufacturer_code
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким кодом производителя уже существует")

    product = FalmecProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар полностью (только для админа)
@router.put("/{product_id}", response_model=FalmecProductResponse)
def update_product(
    product_id: int,
    product_data: FalmecProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(FalmecProduct).filter(FalmecProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Falmec не найден")

    # Проверка уникальности модели
    if product_data.model and product_data.model != product.model:
        existing = db.query(FalmecProduct).filter(
            FalmecProduct.model == product_data.model
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

    # Проверка уникальности кода производителя
    if product_data.manufacturer_code and product_data.manufacturer_code != product.manufacturer_code:
        existing = db.query(FalmecProduct).filter(
            FalmecProduct.manufacturer_code == product_data.manufacturer_code
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким кодом производителя уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара (только для админа)
@router.patch("/{product_id}", response_model=FalmecProductResponse)
def partial_update_product(
    product_id: int,
    product_data: FalmecProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(FalmecProduct).filter(FalmecProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Falmec не найден")

    # Проверка уникальности модели
    if product_data.model and product_data.model != product.model:
        existing = db.query(FalmecProduct).filter(
            FalmecProduct.model == product_data.model
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

    # Проверка уникальности кода производителя
    if product_data.manufacturer_code and product_data.manufacturer_code != product.manufacturer_code:
        existing = db.query(FalmecProduct).filter(
            FalmecProduct.manufacturer_code == product_data.manufacturer_code
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким кодом производителя уже существует")

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
    """Удалить товар Falmec (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(FalmecProduct).filter(FalmecProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Falmec не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам Falmec (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(FalmecProduct).count()
    with_price = db.query(FalmecProduct).filter(FalmecProduct.price_retail > 0).count()
    with_image = db.query(FalmecProduct).filter(
        FalmecProduct.main_image.isnot(None)
    ).count()
    with_model = db.query(FalmecProduct).filter(
        FalmecProduct.model.isnot(None)
    ).count()
    with_manufacturer_code = db.query(FalmecProduct).filter(
        FalmecProduct.manufacturer_code.isnot(None)
    ).count()

    # Статистика по типам монтажа
    mounting_stats = db.query(
        FalmecProduct.mounting_type,
        db.func.count(FalmecProduct.id)
    ).filter(FalmecProduct.mounting_type.isnot(None)).group_by(
        FalmecProduct.mounting_type
    ).order_by(db.func.count(FalmecProduct.id).desc()).all()

    # Статистика по цветам
    color_stats = db.query(
        FalmecProduct.color,
        db.func.count(FalmecProduct.id)
    ).filter(FalmecProduct.color.isnot(None)).group_by(
        FalmecProduct.color
    ).order_by(db.func.count(FalmecProduct.id).desc()).limit(10).all()

    # Диапазоны
    width_range = db.query(
        db.func.min(FalmecProduct.width_cm),
        db.func.max(FalmecProduct.width_cm)
    ).filter(FalmecProduct.width_cm.isnot(None)).first()

    performance_range = db.query(
        db.func.min(FalmecProduct.performance_m3h),
        db.func.max(FalmecProduct.performance_m3h)
    ).filter(FalmecProduct.performance_m3h.isnot(None)).first()

    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_image": with_image,
        "without_image": total - with_image,
        "with_model": with_model,
        "with_manufacturer_code": with_manufacturer_code,
        "mounting_type_distribution": [{"type": t, "count": c} for t, c in mounting_stats],
        "top_colors": [{"color": c, "count": cnt} for c, cnt in color_stats],
        "width_range_cm": {
            "min": float(width_range[0]) if width_range and width_range[0] else None,
            "max": float(width_range[1]) if width_range and width_range[1] else None
        },
        "performance_range_m3h": {
            "min": performance_range[0] if performance_range and performance_range[0] else None,
            "max": performance_range[1] if performance_range and performance_range[1] else None
        }
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    mounting_types = db.query(FalmecProduct.mounting_type).filter(
        FalmecProduct.mounting_type.isnot(None)
    ).distinct().all()

    colors = db.query(FalmecProduct.color).filter(
        FalmecProduct.color.isnot(None)
    ).distinct().all()

    price_range = db.query(
        db.func.min(FalmecProduct.price_retail),
        db.func.max(FalmecProduct.price_retail)
    ).filter(FalmecProduct.price_retail > 0).first()

    width_range = db.query(
        db.func.min(FalmecProduct.width_cm),
        db.func.max(FalmecProduct.width_cm)
    ).filter(FalmecProduct.width_cm.isnot(None)).first()

    performance_range = db.query(
        db.func.min(FalmecProduct.performance_m3h),
        db.func.max(FalmecProduct.performance_m3h)
    ).filter(FalmecProduct.performance_m3h.isnot(None)).first()

    return {
        "mounting_types": [m[0] for m in mounting_types if m[0]],
        "colors": [c[0] for c in colors if c[0]],
        "min_price": float(price_range[0]) if price_range and price_range[0] else 0,
        "max_price": float(price_range[1]) if price_range and price_range[1] else 0,
        "min_width_cm": float(width_range[0]) if width_range and width_range[0] else 0,
        "max_width_cm": float(width_range[1]) if width_range and width_range[1] else 0,
        "min_performance_m3h": performance_range[0] if performance_range and performance_range[0] else 0,
        "max_performance_m3h": performance_range[1] if performance_range and performance_range[1] else 0
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

    deleted_count = db.query(FalmecProduct).filter(
        FalmecProduct.id.in_(product_ids)
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

    products = db.query(FalmecProduct).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Заголовки
    writer.writerow([
        "ID", "Модель", "Код производителя", "Тип монтажа", "Цвет",
        "Ширина, см", "Производительность, м3/час", "Мин. уровень шума, Дб",
        "Управление", "Цена розница, РУБ."
    ])

    # Данные
    for p in products:
        writer.writerow([
            p.id, p.model, p.manufacturer_code, p.mounting_type, p.color,
            p.width_cm, p.performance_m3h, p.min_noise_db,
            p.control_type, p.price_retail
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=falmec_products.csv"}
    )