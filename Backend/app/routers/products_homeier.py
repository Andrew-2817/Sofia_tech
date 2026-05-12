from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.product_homeier import HomeierProduct
from ..models.schemas import HomeierProductCreate, HomeierProductUpdate, HomeierProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/homeier", tags=["products_homeier"])

# Получить все товары
@router.get("/", response_model=List[HomeierProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(HomeierProduct)

    if category_id:
        query = query.filter(HomeierProduct.category_id == category_id)

    products = query.offset(skip).limit(limit).all()
    return products

# Получить товар по ID
@router.get("/{product_id}", response_model=HomeierProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(HomeierProduct).filter(HomeierProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product

# Получить товар по SKU
@router.get("/sku/{sku}", response_model=HomeierProductResponse)
def get_product_by_sku(sku: str, db: Session = Depends(get_db)):
    product = db.query(HomeierProduct).filter(HomeierProduct.sku == sku).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product

# Создать товар (только для админа)
@router.post("/", response_model=HomeierProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: HomeierProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Проверка прав (только админ)
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    # Проверка уникальности SKU
    existing = db.query(HomeierProduct).filter(HomeierProduct.sku == product_data.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="Товар с таким SKU уже существует")

    product = HomeierProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

# Обновить товар (только для админа)
@router.put("/{product_id}", response_model=HomeierProductResponse)
def update_product(
    product_id: int,
    product_data: HomeierProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(HomeierProduct).filter(HomeierProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Если обновляется SKU, проверяем уникальность
    if product_data.sku and product_data.sku != product.sku:
        existing = db.query(HomeierProduct).filter(HomeierProduct.sku == product_data.sku).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким SKU уже существует")

    for key, value in product_data.model_dump(exclude_unset=True).items():
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
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(HomeierProduct).filter(HomeierProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    db.delete(product)
    db.commit()
    return None