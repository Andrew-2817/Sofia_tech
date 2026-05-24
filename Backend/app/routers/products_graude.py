from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_graude import GraudeProduct
from ..models.schemas import GraudeProductCreate, GraudeProductUpdate, GraudeProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/graude", tags=["products_graude"])


@router.get("/", response_model=List[GraudeProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Получить список всех товаров Graude"""
    query = db.query(GraudeProduct)

    if category_id:
        query = query.filter(GraudeProduct.category_id == category_id)

    if brand_id:
        query = query.filter(GraudeProduct.brand_id == brand_id)

    if search:
        # Ищем по наименованию, артикулу (sku) и описанию
        query = query.filter(
            or_(
                GraudeProduct.name.ilike(f"%{search}%"),
                GraudeProduct.sku.ilike(f"%{search}%"),
                GraudeProduct.description.ilike(f"%{search}%")
            )
        )

    products = query.order_by(GraudeProduct.id).offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=GraudeProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """Получить товар по ID"""
    product = db.query(GraudeProduct).filter(GraudeProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product


@router.get("/sku/{sku}", response_model=List[GraudeProductResponse])
def get_products_by_sku(sku: str, db: Session = Depends(get_db)):
    """Получить товары по артикулу (SKU)"""
    products = db.query(GraudeProduct).filter(GraudeProduct.sku.ilike(f"%{sku}%")).all()
    if not products:
        raise HTTPException(status_code=404, detail="Товары не найдены")
    return products


@router.post("/", response_model=GraudeProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: GraudeProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать новый товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = GraudeProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=GraudeProductResponse)
def update_product(
    product_id: int,
    product_data: GraudeProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Полностью обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(GraudeProduct).filter(GraudeProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=GraudeProductResponse)
def partial_update_product(
    product_id: int,
    product_data: GraudeProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Частично обновить товар (только для администратора)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    product = db.query(GraudeProduct).filter(GraudeProduct.id == product_id).first()
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

    product = db.query(GraudeProduct).filter(GraudeProduct.id == product_id).first()
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
    """Получить статистику по товарам Graude (только для админа)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    total = db.query(GraudeProduct).count()
    with_image = db.query(GraudeProduct).filter(GraudeProduct.main_image.isnot(None)).count()

    return {
        "total": total,
        "with_image": with_image,
        "without_image": total - with_image
    }