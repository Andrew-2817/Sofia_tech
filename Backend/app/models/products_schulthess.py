# Backend/app/routers/products_schulthess.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from ..database import get_db
from ..models.product_schulthess import SchulthessProduct
from ..models.schemas import (
    SchulthessProductCreate,
    SchulthessProductUpdate,
    SchulthessProductInDB
)
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/schulthess", tags=["products_schulthess"])


# Получить все товары
@router.get("/", response_model=List[SchulthessProductInDB])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(100, ge=1, le=500, description="Максимальное количество записей"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    search: Optional[str] = Query(None, description="Поиск по названию, модели или группе"),
    min_price: Optional[float] = Query(None, ge=0, description="Минимальная цена"),
    max_price: Optional[float] = Query(None, ge=0, description="Максимальная цена"),
    product_group: Optional[str] = Query(None, description="Фильтр по группе товара"),
    color: Optional[str] = Query(None, description="Фильтр по цвету"),
    door_hinge: Optional[str] = Query(None, description="Фильтр по навеске дверцы"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Schulthess с фильтрацией"""
    query = db.query(SchulthessProduct)

    # Фильтр по категории
    if category_id:
        query = query.filter(SchulthessProduct.category_id == category_id)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(SchulthessProduct.brand_id == brand_id)

    # Фильтр по группе товара
    if product_group:
        query = query.filter(SchulthessProduct.product_group == product_group)

    # Фильтр по цвету
    if color:
        query = query.filter(SchulthessProduct.color == color)

    # Фильтр по навеске дверцы
    if door_hinge:
        query = query.filter(SchulthessProduct.door_hinge == door_hinge)

    # Фильтр по цене
    if min_price is not None:
        query = query.filter(SchulthessProduct.price >= min_price)
    if max_price is not None:
        query = query.filter(SchulthessProduct.price <= max_price)

    # Поиск по названию, модели или группе
    if search:
        query = query.filter(
            or_(
                SchulthessProduct.name.ilike(f"%{search}%"),
                SchulthessProduct.model.ilike(f"%{search}%"),
                SchulthessProduct.product_group.ilike(f"%{search}%"),
                SchulthessProduct.description.ilike(f"%{search}%")
            )
        )

    products = query.order_by(SchulthessProduct.id).offset(skip).limit(limit).all()
    return products


# Получить товар по ID
@router.get("/{product_id}", response_model=SchulthessProductInDB)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(SchulthessProduct).filter(SchulthessProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Schulthess не найден")
    return product


# Получить товар по модели
@router.get("/model/{model}", response_model=Optional[SchulthessProductInDB])
def get_product_by_model(
    model: str,
    db: Session = Depends(get_db)
):
    """Получить товар по модели (точное совпадение)"""
    product = db.query(SchulthessProduct).filter(SchulthessProduct.model == model).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с моделью {model} не найден")
    return product


# Поиск товаров по модели (частичное совпадение)
@router.get("/model/search/{model}", response_model=List[SchulthessProductInDB])
def search_products_by_model(
    model: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Поиск товаров по модели (частичное совпадение)"""
    products = db.query(SchulthessProduct).filter(
        SchulthessProduct.model.ilike(f"%{model}%")
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары с моделью содержащей '{model}' не найдены")
    return products


# Получить товары по группе
@router.get("/group/{product_group}", response_model=List[SchulthessProductInDB])
def get_products_by_group(
    product_group: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по группе товара"""
    products = db.query(SchulthessProduct).filter(
        SchulthessProduct.product_group == product_group
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары группы '{product_group}' не найдены")
    return products


# Получить товары по цвету
@router.get("/color/{color}", response_model=List[SchulthessProductInDB])
def get_products_by_color(
    color: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по цвету"""
    products = db.query(SchulthessProduct).filter(
        SchulthessProduct.color == color
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары цвета '{color}' не найдены")
    return products


# Создать товар (только для админа)
@router.post("/", response_model=SchulthessProductInDB, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: SchulthessProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар Schulthess (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка уникальности модели (если указана)
    if product_data.model:
        existing = db.query(SchulthessProduct).filter(
            SchulthessProduct.model == product_data.model
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

    product = SchulthessProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар полностью (только для админа)
@router.put("/{product_id}", response_model=SchulthessProductInDB)
def update_product(
    product_id: int,
    product_data: SchulthessProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(SchulthessProduct).filter(SchulthessProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Schulthess не найден")

    # Если обновляется модель, проверяем уникальность
    if product_data.model and product_data.model != product.model:
        existing = db.query(SchulthessProduct).filter(
            SchulthessProduct.model == product_data.model
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара (только для админа)
@router.patch("/{product_id}", response_model=SchulthessProductInDB)
def partial_update_product(
    product_id: int,
    product_data: SchulthessProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(SchulthessProduct).filter(SchulthessProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Schulthess не найден")

    # Если обновляется модель, проверяем уникальность
    if product_data.model and product_data.model != product.model:
        existing = db.query(SchulthessProduct).filter(
            SchulthessProduct.model == product_data.model
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

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
    """Удалить товар Schulthess (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(SchulthessProduct).filter(SchulthessProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Schulthess не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам Schulthess (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(SchulthessProduct).count()
    with_price = db.query(SchulthessProduct).filter(SchulthessProduct.price > 0).count()
    with_image = db.query(SchulthessProduct).filter(
        SchulthessProduct.main_image.isnot(None)
    ).count()
    with_model = db.query(SchulthessProduct).filter(
        SchulthessProduct.model.isnot(None)
    ).count()

    # Статистика по группам товаров
    group_stats = db.query(
        SchulthessProduct.product_group,
        db.func.count(SchulthessProduct.id)
    ).filter(SchulthessProduct.product_group.isnot(None)).group_by(
        SchulthessProduct.product_group
    ).order_by(db.func.count(SchulthessProduct.id).desc()).limit(10).all()

    # Статистика по цветам
    color_stats = db.query(
        SchulthessProduct.color,
        db.func.count(SchulthessProduct.id)
    ).filter(SchulthessProduct.color.isnot(None)).group_by(
        SchulthessProduct.color
    ).order_by(db.func.count(SchulthessProduct.id).desc()).all()

    # Статистика по навеске дверцы
    hinge_stats = db.query(
        SchulthessProduct.door_hinge,
        db.func.count(SchulthessProduct.id)
    ).filter(SchulthessProduct.door_hinge.isnot(None)).group_by(
        SchulthessProduct.door_hinge
    ).all()

    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_image": with_image,
        "without_image": total - with_image,
        "with_model": with_model,
        "without_model": total - with_model,
        "top_product_groups": [{"group": g, "count": c} for g, c in group_stats],
        "color_distribution": [{"color": c, "count": cnt} for c, cnt in color_stats],
        "door_hinge_distribution": [{"hinge": h, "count": c} for h, c in hinge_stats]
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    product_groups = db.query(SchulthessProduct.product_group).filter(
        SchulthessProduct.product_group.isnot(None)
    ).distinct().all()

    colors = db.query(SchulthessProduct.color).filter(
        SchulthessProduct.color.isnot(None)
    ).distinct().all()

    door_hinges = db.query(SchulthessProduct.door_hinge).filter(
        SchulthessProduct.door_hinge.isnot(None)
    ).distinct().all()

    price_range = db.query(
        db.func.min(SchulthessProduct.price),
        db.func.max(SchulthessProduct.price)
    ).filter(SchulthessProduct.price > 0).first()

    return {
        "product_groups": [g[0] for g in product_groups if g[0]],
        "colors": [c[0] for c in colors if c[0]],
        "door_hinges": [h[0] for h in door_hinges if h[0]],
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

    deleted_count = db.query(SchulthessProduct).filter(
        SchulthessProduct.id.in_(product_ids)
    ).delete(synchronize_session=False)

    db.commit()

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Товары не найдены")

    return None  # 204 No Content


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

    products = db.query(SchulthessProduct).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Заголовки
    writer.writerow([
        "ID", "Модель", "Название", "Группа товара", "Цвет",
        "Навеска дверцы", "Цена", "Ширина", "Высота", "Глубина",
        "Объем", "Вес брутто", "Программы", "Описание"
    ])

    # Данные
    for p in products:
        writer.writerow([
            p.id, p.model, p.name, p.product_group, p.color,
            p.door_hinge, p.price, p.width, p.height, p.depth,
            p.volume, p.gross_weight, p.programs, p.description
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=schulthess_products.csv"}
    )