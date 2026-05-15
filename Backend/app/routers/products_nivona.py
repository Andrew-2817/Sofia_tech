from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.product_nivona import NivonaProduct
from ..models.schemas import NivonaProductCreate, NivonaProductUpdate, NivonaProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/nivona", tags=["products_nivona"])

# Получить все товары Nivona
@router.get("/", response_model=List[NivonaProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(NivonaProduct)

    if category_id:
        query = query.filter(NivonaProduct.category_id == category_id)

    if search:
        query = query.filter(
            NivonaProduct.name.ilike(f"%{search}%") |
            NivonaProduct.sku.ilike(f"%{search}%") |
            NivonaProduct.model.ilike(f"%{search}%")
        )

    products = query.offset(skip).limit(limit).all()
    return products

# Получить товар Nivona по ID
@router.get("/{product_id}", response_model=NivonaProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(NivonaProduct).filter(NivonaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product

# Получить товар Nivona по SKU
@router.get("/sku/{sku}", response_model=NivonaProductResponse)
def get_product_by_sku(sku: str, db: Session = Depends(get_db)):
    product = db.query(NivonaProduct).filter(NivonaProduct.sku == sku).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product

# Создать товар Nivona (только для админа)
@router.post("/", response_model=NivonaProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: NivonaProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = NivonaProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

# Обновить товар Nivona (только для админа)
@router.put("/{product_id}", response_model=NivonaProductResponse)
def update_product(
    product_id: int,
    product_data: NivonaProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(NivonaProduct).filter(NivonaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product

# Удалить товар Nivona (только для админа)
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(NivonaProduct).filter(NivonaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    db.delete(product)
    db.commit()
    return None