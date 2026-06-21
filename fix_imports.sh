#!/bin/bash
set -e

echo "🔧 Исправление импортов в роутерах..."

# Исправляем products_teka.py
cat > Backend/app/routers/products_teka.py << 'EOF'
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_teka import TekaProduct
from ..models.schemas import TekaProductCreate, TekaProductUpdate, TekaProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/teka", tags=["products_teka"])

@router.get("/", response_model=List[TekaProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10000, ge=1, le=50000),
    category_id: Optional[int] = Query(None),
    brand_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    min_dmd: Optional[int] = Query(None, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(TekaProduct)
    if category_id:
        query = query.filter(TekaProduct.category_id == category_id)
    if brand_id:
        query = query.filter(TekaProduct.brand_id == brand_id)
    if min_price is not None:
        query = query.filter(TekaProduct.price >= min_price)
    if max_price is not None:
        query = query.filter(TekaProduct.price <= max_price)
    if min_dmd is not None:
        query = query.filter(TekaProduct.dmd_quantity >= min_dmd)
    if search:
        query = query.filter(TekaProduct.name.ilike(f"%{search}%"))
    products = query.order_by(TekaProduct.id).offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=TekaProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")
    return product

@router.post("/", response_model=TekaProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: TekaProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    existing = db.query(TekaProduct).filter(TekaProduct.name == product_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")
    product = TekaProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=TekaProductResponse)
def update_product(
    product_id: int,
    product_data: TekaProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")
    if product_data.name and product_data.name != product.name:
        existing = db.query(TekaProduct).filter(TekaProduct.name == product_data.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")
    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.patch("/{product_id}", response_model=TekaProductResponse)
def partial_update_product(
    product_id: int,
    product_data: TekaProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")
    if product_data.name and product_data.name != product.name:
        existing = db.query(TekaProduct).filter(TekaProduct.name == product_data.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким названием уже существует")
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
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    product = db.query(TekaProduct).filter(TekaProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Teka не найден")
    db.delete(product)
    db.commit()
    return None

@router.get("/stats/count", response_model=dict)
def get_products_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    total = db.query(TekaProduct).count()
    with_price = db.query(TekaProduct).filter(TekaProduct.price > 0).count()
    with_dmd = db.query(TekaProduct).filter(TekaProduct.dmd_quantity.isnot(None)).count()
    return {
        "total": total,
        "with_price": with_price,
        "without_price": total - with_price,
        "with_dmd": with_dmd,
        "without_dmd": total - with_dmd,
    }

@router.get("/export/csv")
def export_products_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    import csv
    from fastapi.responses import StreamingResponse
    import io
    products = db.query(TekaProduct).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Название", "Цена", "DMD кол-во"])
    for p in products:
        writer.writerow([p.id, p.name, p.price, p.dmd_quantity])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=teka_products.csv"})
EOF

# Исправляем products_liebherr.py
cat > Backend/app/routers/products_liebherr.py << 'EOF'
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from ..database import get_db
from ..models.product_liebherr import LiebherrProduct
from ..models.schemas import LiebherrProductCreate, LiebherrProductUpdate, LiebherrProductResponse
from ..utils.dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/products/liebherr", tags=["products_liebherr"])

@router.get("/", response_model=List[LiebherrProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(400, ge=1, le=500),
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(LiebherrProduct)
    if category_id:
        query = query.filter(LiebherrProduct.category_id == category_id)
    if brand_id:
        query = query.filter(LiebherrProduct.brand_id == brand_id)
    if search:
        query = query.filter(
            or_(
                LiebherrProduct.name.ilike(f"%{search}%"),
                LiebherrProduct.model.ilike(f"%{search}%"),
                LiebherrProduct.ean.ilike(f"%{search}%")
            )
        )
    products = query.order_by(LiebherrProduct.id).offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=LiebherrProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(LiebherrProduct).filter(LiebherrProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Liebherr не найден")
    return product

@router.post("/", response_model=LiebherrProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: LiebherrProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    if product_data.ean:
        existing = db.query(LiebherrProduct).filter(LiebherrProduct.ean == product_data.ean).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким EAN уже существует")
    product = LiebherrProduct(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=LiebherrProductResponse)
def update_product(
    product_id: int,
    product_data: LiebherrProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    product = db.query(LiebherrProduct).filter(LiebherrProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Liebherr не найден")
    if product_data.ean and product_data.ean != product.ean:
        existing = db.query(LiebherrProduct).filter(LiebherrProduct.ean == product_data.ean).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким EAN уже существует")
    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.patch("/{product_id}", response_model=LiebherrProductResponse)
def partial_update_product(
    product_id: int,
    product_data: LiebherrProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    product = db.query(LiebherrProduct).filter(LiebherrProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Liebherr не найден")
    if product_data.ean and product_data.ean != product.ean:
        existing = db.query(LiebherrProduct).filter(LiebherrProduct.ean == product_data.ean).first()
        if existing:
            raise HTTPException(status_code=400, detail="Товар с таким EAN уже существует")
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
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    product = db.query(LiebherrProduct).filter(LiebherrProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Товар Liebherr не найден")
    db.delete(product)
    db.commit()
    return None

@router.get("/stats/count", response_model=dict)
def get_products_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    total = db.query(LiebherrProduct).count()
    with_price_public = db.query(LiebherrProduct).filter(LiebherrProduct.price_public.isnot(None)).count()
    return {
        "total": total,
        "with_price_public": with_price_public,
        "without_price": total - with_price_public
    }
EOF

echo "✅ Импорты исправлены"
echo "🚀 Перезапустите сервер: cd Backend && uvicorn app.main:app --reload"
