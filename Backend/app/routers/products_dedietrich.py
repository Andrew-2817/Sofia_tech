from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_dedietrich import DedietrichProduct
from ..models.schemas import DedietrichProductCreate, DedietrichProductUpdate, DedietrichProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/dedietrich", tags=["products_dedietrich"])


@router.get("/", response_model=List[DedietrichProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Dedietrich"""
    query = db.query(DedietrichProduct)

    if category_id:
        query = query.filter(DedietrichProduct.category_id == category_id)

    if brand_id:
        query = query.filter(DedietrichProduct.brand_id == brand_id)

    if search:
        query = query.filter(
            or_(
                DedietrichProduct.name.ilike(f"%{search}%"),
                DedietrichProduct.model.ilike(f"%{search}%"),
                DedietrichProduct.line.ilike(f"%{search}%")
            )
        )

    products = query.order_by(DedietrichProduct.id).offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=DedietrichProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """Получить товар по ID"""
    product = db.query(DedietrichProduct).filter(DedietrichProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product


@router.get("/model/{model}", response_model=List[DedietrichProductResponse])
def get_products_by_model(model: str, db: Session = Depends(get_db)):
    """Получить товары по модели"""
    products = db.query(DedietrichProduct).filter(DedietrichProduct.model.ilike(f"%{model}%")).all()
    if not products:
        raise HTTPException(status_code=404, detail="Товары не найдены")
    return products


@router.post("/", response_model=DedietrichProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: DedietrichProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = DedietrichProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=DedietrichProductResponse)
def update_product(
    product_id: int,
    product_data: DedietrichProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(DedietrichProduct).filter(DedietrichProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=DedietrichProductResponse)
def partial_update_product(
    product_id: int,
    product_data: DedietrichProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частично обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(DedietrichProduct).filter(DedietrichProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(DedietrichProduct).filter(DedietrichProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    db.delete(product)
    db.commit()
    return None


@router.get("/stats/count", response_model=dict)
def get_products_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить статистику по товарам (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(DedietrichProduct).count()
    with_image = db.query(DedietrichProduct).filter(DedietrichProduct.main_image.isnot(None)).count()

    return {
        "total": total,
        "with_image": with_image,
        "without_image": total - with_image
    }