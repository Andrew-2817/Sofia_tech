# Backend/app/routers/products_elica.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_elica import ElicaProduct
from ..models.schemas import ElicaProductCreate, ElicaProductUpdate, ElicaProductInDB
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/elica", tags=["products_elica"])


# Получить все товары
@router.get("/", response_model=List[ElicaProductInDB])
def get_all_products(
    skip: int = Query(0, ge=0, description="Количество пропускаемых записей"),
    limit: int = Query(100, ge=1, le=500, description="Максимальное количество записей"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    brand_id: Optional[int] = Query(None, description="Фильтр по ID бренда"),
    search: Optional[str] = Query(None, description="Поиск по названию, модели или коду"),
    type_of_price: Optional[str] = Query(None, description="Фильтр по типу цены"),
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Elica с фильтрацией"""
    query = db.query(ElicaProduct)

    # Фильтр по категории
    if category_id:
        query = query.filter(ElicaProduct.category_id == category_id)

    # Фильтр по бренду
    if brand_id:
        query = query.filter(ElicaProduct.brand_id == brand_id)

    # Фильтр по типу цены
    if type_of_price:
        query = query.filter(ElicaProduct.type_of_price == type_of_price)

    # Поиск по названию, модели или коду
    if search:
        query = query.filter(
            or_(
                ElicaProduct.name.ilike(f"%{search}%"),
                ElicaProduct.model.ilike(f"%{search}%"),
                ElicaProduct.actual_code.ilike(f"%{search}%"),
                ElicaProduct.description.ilike(f"%{search}%")
            )
        )

    products = query.order_by(ElicaProduct.id).offset(skip).limit(limit).all()
    return products


# Получить товар по ID
@router.get("/{product_id}", response_model=ElicaProductInDB)
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(ElicaProduct).filter(ElicaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Elica не найден")
    return product


# Получить товар по модели
@router.get("/model/{model}", response_model=Optional[ElicaProductInDB])
def get_product_by_model(
    model: str,
    db: Session = Depends(get_db)
):
    """Получить товар по модели (точное совпадение)"""
    product = db.query(ElicaProduct).filter(ElicaProduct.model == model).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с моделью '{model}' не найден")
    return product


# Получить товар по коду
@router.get("/code/{actual_code}", response_model=Optional[ElicaProductInDB])
def get_product_by_actual_code(
    actual_code: str,
    db: Session = Depends(get_db)
):
    """Получить товар по actual коду"""
    product = db.query(ElicaProduct).filter(ElicaProduct.actual_code == actual_code).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с кодом '{actual_code}' не найден")
    return product


# Поиск товаров по названию
@router.get("/search/{query}", response_model=List[ElicaProductInDB])
def search_products_by_name(
    query: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Поиск товаров по названию (частичное совпадение)"""
    products = db.query(ElicaProduct).filter(
        or_(
            ElicaProduct.name.ilike(f"%{query}%"),
            ElicaProduct.model.ilike(f"%{query}%"),
            ElicaProduct.actual_code.ilike(f"%{query}%")
        )
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары с названием содержащим '{query}' не найдены")
    return products


# Получить товары по типу цены
@router.get("/price-type/{type_of_price}", response_model=List[ElicaProductInDB])
def get_products_by_price_type(
    type_of_price: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Получить товары по типу цены"""
    products = db.query(ElicaProduct).filter(
        ElicaProduct.type_of_price == type_of_price
    ).offset(skip).limit(limit).all()

    if not products:
        raise HTTPException(status_code=404, detail=f"Товары с типом цены '{type_of_price}' не найдены")
    return products


# Создать товар (только для админа)
@router.post("/", response_model=ElicaProductInDB, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ElicaProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар Elica (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    # Проверка уникальности названия
    existing = db.query(ElicaProduct).filter(
        ElicaProduct.name == product_data.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    # Проверка уникальности модели (если указана)
    if product_data.model:
        existing_model = db.query(ElicaProduct).filter(
            ElicaProduct.model == product_data.model
        ).first()
        if existing_model:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

    product = ElicaProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# Обновить товар полностью (только для админа)
@router.put("/{product_id}", response_model=ElicaProductInDB)
def update_product(
    product_id: int,
    product_data: ElicaProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(ElicaProduct).filter(ElicaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Elica не найден")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing = db.query(ElicaProduct).filter(
            ElicaProduct.name == product_data.name
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    # Если обновляется модель, проверяем уникальность
    if product_data.model and product_data.model != product.model:
        existing_model = db.query(ElicaProduct).filter(
            ElicaProduct.model == product_data.model
        ).first()
        if existing_model:
            raise HTTPException(status_code=400, detail="Товар с такой моделью уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


# Частичное обновление товара (только для админа)
@router.patch("/{product_id}", response_model=ElicaProductInDB)
def partial_update_product(
    product_id: int,
    product_data: ElicaProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частичное обновление товара (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(ElicaProduct).filter(ElicaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Elica не найден")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing = db.query(ElicaProduct).filter(
            ElicaProduct.name == product_data.name
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    # Если обновляется модель, проверяем уникальность
    if product_data.model and product_data.model != product.model:
        existing_model = db.query(ElicaProduct).filter(
            ElicaProduct.model == product_data.model
        ).first()
        if existing_model:
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
    """Удалить товар Elica (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав. Требуются права администратора.")

    product = db.query(ElicaProduct).filter(ElicaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Elica не найден")

    db.delete(product)
    db.commit()
    return None


# Статистика по товарам (только для админа)
@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить расширенную статистику по товарам Elica (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(ElicaProduct).count()
    with_image = db.query(ElicaProduct).filter(
        ElicaProduct.main_image.isnot(None)
    ).count()
    with_model = db.query(ElicaProduct).filter(
        ElicaProduct.model.isnot(None)
    ).count()
    with_actual_code = db.query(ElicaProduct).filter(
        ElicaProduct.actual_code.isnot(None)
    ).count()
    with_description = db.query(ElicaProduct).filter(
        ElicaProduct.description.isnot(None)
    ).count()

    # Статистика по типам цены
    price_type_stats = db.query(
        ElicaProduct.type_of_price,
        db.func.count(ElicaProduct.id)
    ).filter(ElicaProduct.type_of_price.isnot(None)).group_by(
        ElicaProduct.type_of_price
    ).order_by(db.func.count(ElicaProduct.id).desc()).all()

    return {
        "total": total,
        "with_image": with_image,
        "without_image": total - with_image,
        "with_model": with_model,
        "without_model": total - with_model,
        "with_actual_code": with_actual_code,
        "without_actual_code": total - with_actual_code,
        "with_description": with_description,
        "without_description": total - with_description,
        "price_type_distribution": [{"type": t, "count": c} for t, c in price_type_stats]
    }


# Получить уникальные значения для фильтров
@router.get("/filters/options", response_model=dict)
def get_filter_options(
    db: Session = Depends(get_db)
):
    """Получить доступные значения для фильтрации"""
    price_types = db.query(ElicaProduct.type_of_price).filter(
        ElicaProduct.type_of_price.isnot(None)
    ).distinct().all()

    categories = db.query(
        ElicaProduct.category_id,
        db.func.count(ElicaProduct.id)
    ).filter(ElicaProduct.category_id.isnot(None)).group_by(
        ElicaProduct.category_id
    ).order_by(ElicaProduct.category_id).all()

    return {
        "price_types": [t[0] for t in price_types if t[0]],
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

    deleted_count = db.query(ElicaProduct).filter(
        ElicaProduct.id.in_(product_ids)
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

    products = db.query(ElicaProduct).all()

    output = io.StringIO()
    writer = csv.writer(output)

    # Заголовки
    writer.writerow([
        "ID", "Название", "Модель", "Код", "Тип цены", "Описание"
    ])

    # Данные
    for p in products:
        writer.writerow([
            p.id, p.name, p.model, p.actual_code, p.type_of_price,
            p.description[:200] if p.description else ""
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=elica_products.csv"}
    )