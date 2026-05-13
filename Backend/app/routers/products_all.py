from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from ..database import get_db
from ..models.product_homeier import HomeierProduct
from ..models.product_brandt import BrandtProduct
from ..models.category import Category
from ..models.brand import Brand
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/products/all", tags=["products_all"])

# Схема для объединенного ответа
class UnifiedProductResponse(BaseModel):
    id: int
    source_table: str  # homeier или brandt
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    brand_id: Optional[int] = None
    brand_name: Optional[str] = None
    name: str
    price: float
    main_image: Optional[str] = None
    comment: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    # Поля для Homeier
    sku: Optional[str] = None
    group_level_1: Optional[str] = None
    group_level_2: Optional[str] = None
    width: Optional[float] = None
    height: Optional[float] = None
    depth: Optional[float] = None
    volume: Optional[float] = None
    net_weight: Optional[float] = None
    gross_weight: Optional[float] = None
    # Поля для Brandt
    model: Optional[str] = None
    specifications: Optional[str] = None
    design: Optional[str] = None

    class Config:
        from_attributes = True

# Получить все товары из всех таблиц
@router.get("/", response_model=List[UnifiedProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    all_products = []

    # Получаем товары из Homeier
    homeier_query = db.query(HomeierProduct)
    if category_id:
        homeier_query = homeier_query.filter(HomeierProduct.category_id == category_id)
    if brand_id:
        homeier_query = homeier_query.filter(HomeierProduct.brand_id == brand_id)
    if search:
        homeier_query = homeier_query.filter(
            HomeierProduct.name.ilike(f"%{search}%") |
            HomeierProduct.sku.ilike(f"%{search}%")
        )

    homeier_products = homeier_query.all()

    for product in homeier_products:
        # Получаем название категории
        category_name = None
        if product.category_id:
            category = db.query(Category).filter(Category.id == product.category_id).first()
            category_name = category.name if category else None

        # Получаем название бренда
        brand_name = None
        if product.brand_id:
            brand = db.query(Brand).filter(Brand.id == product.brand_id).first()
            brand_name = brand.name if brand else None

        all_products.append(UnifiedProductResponse(
            id=product.id,
            source_table="homeier",
            category_id=product.category_id,
            category_name=category_name,
            brand_id=product.brand_id,
            brand_name=brand_name,
            name=product.name,
            price=product.price,
            main_image=product.main_image,
            comment=product.comment,
            description=product.description,
            color=product.color,
            sku=product.sku,
            group_level_1=product.group_level_1,
            group_level_2=product.group_level_2,
            width=product.width,
            height=product.height,
            depth=product.depth,
            volume=product.volume,
            net_weight=product.net_weight,
            gross_weight=product.gross_weight,
            model=None,
            specifications=None,
            design=None
        ))

    # Получаем товары из Brandt
    brandt_query = db.query(BrandtProduct)
    if category_id:
        brandt_query = brandt_query.filter(BrandtProduct.category_id == category_id)
    if brand_id:
        brandt_query = brandt_query.filter(BrandtProduct.brand_id == brand_id)
    if search:
        brandt_query = brandt_query.filter(
            BrandtProduct.name.ilike(f"%{search}%") |
            BrandtProduct.model.ilike(f"%{search}%")
        )

    brandt_products = brandt_query.all()

    for product in brandt_products:
        # Получаем название категории
        category_name = None
        if product.category_id:
            category = db.query(Category).filter(Category.id == product.category_id).first()
            category_name = category.name if category else None

        # Получаем название бренда
        brand_name = None
        if product.brand_id:
            brand = db.query(Brand).filter(Brand.id == product.brand_id).first()
            brand_name = brand.name if brand else None

        all_products.append(UnifiedProductResponse(
            id=product.id,
            source_table="brandt",
            category_id=product.category_id,
            category_name=category_name,
            brand_id=product.brand_id,
            brand_name=brand_name,
            name=product.name,
            price=product.price,
            main_image=product.main_image,
            comment=product.comment,
            description=None,
            color=None,
            sku=None,
            group_level_1=None,
            group_level_2=None,
            width=None,
            height=None,
            depth=None,
            volume=None,
            net_weight=None,
            gross_weight=None,
            model=product.model,
            specifications=product.specifications,
            design=product.design
        ))

    # Сортируем по цене и применяем пагинацию
    all_products.sort(key=lambda x: x.price)
    all_products = all_products[skip:skip + limit]

    return all_products

# Получить товар по ID из любой таблицы
@router.get("/{product_id}", response_model=UnifiedProductResponse)
def get_product_by_id_any_table(
    product_id: int,
    source: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Получить товар по ID.
    Если указан source ('homeier' или 'brandt') - ищет только в указанной таблице.
    Если не указан - ищет сначала в Homeier, потом в Brandt.
    """

    # Если указан источник
    if source == "homeier":
        product = db.query(HomeierProduct).filter(HomeierProduct.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Товар не найден в таблице Homeier")

        category_name = None
        if product.category_id:
            category = db.query(Category).filter(Category.id == product.category_id).first()
            category_name = category.name if category else None

        brand_name = None
        if product.brand_id:
            brand = db.query(Brand).filter(Brand.id == product.brand_id).first()
            brand_name = brand.name if brand else None

        return UnifiedProductResponse(
            id=product.id,
            source_table="homeier",
            category_id=product.category_id,
            category_name=category_name,
            brand_id=product.brand_id,
            brand_name=brand_name,
            name=product.name,
            price=product.price,
            main_image=product.main_image,
            comment=product.comment,
            description=product.description,
            color=product.color,
            sku=product.sku,
            group_level_1=product.group_level_1,
            group_level_2=product.group_level_2,
            width=product.width,
            height=product.height,
            depth=product.depth,
            volume=product.volume,
            net_weight=product.net_weight,
            gross_weight=product.gross_weight,
            model=None,
            specifications=None,
            design=None
        )

    elif source == "brandt":
        product = db.query(BrandtProduct).filter(BrandtProduct.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Товар не найден в таблице Brandt")

        category_name = None
        if product.category_id:
            category = db.query(Category).filter(Category.id == product.category_id).first()
            category_name = category.name if category else None

        brand_name = None
        if product.brand_id:
            brand = db.query(Brand).filter(Brand.id == product.brand_id).first()
            brand_name = brand.name if brand else None

        return UnifiedProductResponse(
            id=product.id,
            source_table="brandt",
            category_id=product.category_id,
            category_name=category_name,
            brand_id=product.brand_id,
            brand_name=brand_name,
            name=product.name,
            price=product.price,
            main_image=product.main_image,
            comment=product.comment,
            description=None,
            color=None,
            sku=None,
            group_level_1=None,
            group_level_2=None,
            width=None,
            height=None,
            depth=None,
            volume=None,
            net_weight=None,
            gross_weight=None,
            model=product.model,
            specifications=product.specifications,
            design=product.design
        )

    # Если источник не указан, ищем сначала в Homeier
    product = db.query(HomeierProduct).filter(HomeierProduct.id == product_id).first()
    if product:
        category_name = None
        if product.category_id:
            category = db.query(Category).filter(Category.id == product.category_id).first()
            category_name = category.name if category else None

        brand_name = None
        if product.brand_id:
            brand = db.query(Brand).filter(Brand.id == product.brand_id).first()
            brand_name = brand.name if brand else None

        return UnifiedProductResponse(
            id=product.id,
            source_table="homeier",
            category_id=product.category_id,
            category_name=category_name,
            brand_id=product.brand_id,
            brand_name=brand_name,
            name=product.name,
            price=product.price,
            main_image=product.main_image,
            comment=product.comment,
            description=product.description,
            color=product.color,
            sku=product.sku,
            group_level_1=product.group_level_1,
            group_level_2=product.group_level_2,
            width=product.width,
            height=product.height,
            depth=product.depth,
            volume=product.volume,
            net_weight=product.net_weight,
            gross_weight=product.gross_weight,
            model=None,
            specifications=None,
            design=None
        )

    # Ищем в Brandt
    product = db.query(BrandtProduct).filter(BrandtProduct.id == product_id).first()
    if product:
        category_name = None
        if product.category_id:
            category = db.query(Category).filter(Category.id == product.category_id).first()
            category_name = category.name if category else None

        brand_name = None
        if product.brand_id:
            brand = db.query(Brand).filter(Brand.id == product.brand_id).first()
            brand_name = brand.name if brand else None

        return UnifiedProductResponse(
            id=product.id,
            source_table="brandt",
            category_id=product.category_id,
            category_name=category_name,
            brand_id=product.brand_id,
            brand_name=brand_name,
            name=product.name,
            price=product.price,
            main_image=product.main_image,
            comment=product.comment,
            description=None,
            color=None,
            sku=None,
            group_level_1=None,
            group_level_2=None,
            width=None,
            height=None,
            depth=None,
            volume=None,
            net_weight=None,
            gross_weight=None,
            model=product.model,
            specifications=product.specifications,
            design=product.design
        )

    raise HTTPException(status_code=404, detail="Товар не найден")