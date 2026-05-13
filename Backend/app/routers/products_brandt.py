from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.product_brandt import BrandtProduct
from ..models.schemas import BrandtProductCreate, BrandtProductUpdate, BrandtProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/brandt", tags=["products_brandt"])

# Получить все товары Brandt
@router.get("/", response_model=List[BrandtProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(BrandtProduct)

    if category_id:
        query = query.filter(BrandtProduct.category_id == category_id)

    products = query.offset(skip).limit(limit).all()
    return products

# Получить товар Brandt по ID
@router.get("/{product_id}", response_model=BrandtProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(BrandtProduct).filter(BrandtProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product

# Получить товар Brandt по названию
@router.get("/name/{name}", response_model=BrandtProductResponse)
def get_product_by_name(name: str, db: Session = Depends(get_db)):
    product = db.query(BrandtProduct).filter(BrandtProduct.name == name).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product

# Получить товары Brandt по модели
@router.get("/model/{model}", response_model=List[BrandtProductResponse])
def get_products_by_model(
    model: str,
    db: Session = Depends(get_db)
):
    products = db.query(BrandtProduct).filter(BrandtProduct.model == model).all()
    if not products:
        raise HTTPException(status_code=404, detail="Товары с такой моделью не найдены")
    return products

# Создать товар Brandt (только для админа)
@router.post("/", response_model=BrandtProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: BrandtProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Проверка прав (только админ)
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    # Проверка уникальности названия
    existing = db.query(BrandtProduct).filter(BrandtProduct.name == product_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    product = BrandtProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

# Обновить товар Brandt (только для админа)
@router.put("/{product_id}", response_model=BrandtProductResponse)
def update_product(
    product_id: int,
    product_data: BrandtProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(BrandtProduct).filter(BrandtProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Если обновляется название, проверяем уникальность
    if product_data.name and product_data.name != product.name:
        existing = db.query(BrandtProduct).filter(BrandtProduct.name == product_data.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product

# Удалить товар Brandt (только для админа)
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(BrandtProduct).filter(BrandtProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    db.delete(product)
    db.commit()
    return None