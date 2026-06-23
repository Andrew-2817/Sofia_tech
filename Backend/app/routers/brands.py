# routers/brands.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models import Brand

router = APIRouter(prefix="/api/brands", tags=["brands"])

@router.get("/")
async def get_brands(db: AsyncSession = Depends(get_db)):
    """Получить список всех брендов"""
    result = db.execute(select(Brand).order_by(Brand.id))
    brands = result.scalars().all()
    return [
        {
            "id": brand.id,
            "name": brand.name
        }
        for brand in brands
    ]

@router.get("/{brand_id}")
async def get_brand(brand_id: int, db: AsyncSession = Depends(get_db)):
    """Получить бренд по ID"""
    result = await db.execute(select(Brand).where(Brand.id == brand_id))
    brand = result.scalar_one_or_none()
    if not brand:
        return {"error": "Brand not found"}
    return {
        "id": brand.id,
        "name": brand.name
    }