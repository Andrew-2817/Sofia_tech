from fastapi import APIRouter, Request, Form, UploadFile, File, Depends, HTTPException, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from app.models import Product, Category, Brand
from app.database import async_session_maker
import os
import shutil
from datetime import datetime

router = APIRouter(prefix="/admin-custom", tags=["Admin Products"])
templates = Jinja2Templates(directory="app/templates")

UPLOAD_DIR = "static/uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

def save_image(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename)[1]
    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return f"/uploads/products/{filename}"

@router.get("/products", response_class=HTMLResponse)
async def products_list(
    request: Request,
    page: int = Query(1, ge=1),
    search: str = "",
    brand_id: int = Query(0, ge=0),
    category_id: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_db)
):
    per_page = 10
    offset = (page - 1) * per_page

    query = select(Product)
    count_query = select(func.count()).select_from(Product)

    filters = []
    if search:
        if search.isdigit():
            filters.append(Product.id == int(search))
        else:
            term = f"%{search}%"
            filters.append(
                or_(
                    Product.name.ilike(term),
                    Product.sku.ilike(term),
                    Product.description.ilike(term),
                )
            )

    if brand_id > 0:
        filters.append(Product.brand_id == brand_id)
    if category_id > 0:
        filters.append(Product.category_id == category_id)

    if filters:
        query = query.where(and_(*filters))
        count_query = count_query.where(and_(*filters))

    query = query.offset(offset).limit(per_page).order_by(Product.id.desc())
    products = (await session.execute(query)).scalars().all()
    total = (await session.execute(count_query)).scalar()

    for p in products:
        await session.refresh(p, attribute_names=["brand", "category"])

    # ★★★ ТОЛЬКО КАТЕГОРИИ 3-ГО УРОВНЯ ★★★
    brands = (await session.execute(select(Brand).order_by(Brand.name))).scalars().all()
    categories = (await session.execute(
        select(Category).where(Category.level == 3).order_by(Category.name)
    )).scalars().all()

    template = templates.get_template("admin/products_list.html")
    content = template.render(
        request=request,
        products=products,
        page=page,
        per_page=per_page,
        total=total,
        search=search,
        brand_id=brand_id,
        category_id=category_id,
        brands=brands,
        categories=categories,
    )
    return HTMLResponse(content)

@router.get("/products/create", response_class=HTMLResponse)
async def product_create_form(
    request: Request,
    session: AsyncSession = Depends(get_db)
):
    brands = (await session.execute(select(Brand).order_by(Brand.name))).scalars().all()
    # ★★★ ТОЛЬКО КАТЕГОРИИ 3-ГО УРОВНЯ ★★★
    categories = (await session.execute(
        select(Category).where(Category.level == 3).order_by(Category.name)
    )).scalars().all()
    template = templates.get_template("admin/product_create.html")
    content = template.render(
        request=request,
        brands=brands,
        categories=categories,
    )
    return HTMLResponse(content)

@router.post("/products/create")
async def product_create(
    name: str = Form(...),
    sku: str = Form(None),
    price: float = Form(None),
    brand_id: int = Form(None),
    category_id: int = Form(None),
    description: str = Form(None),
    color: str = Form(None),
    width: float = Form(None),
    height: float = Form(None),
    depth: float = Form(None),
    weight: float = Form(None),
    main_image: UploadFile = File(None),
    session: AsyncSession = Depends(get_db)
):
    image_path = None
    if main_image and main_image.filename:
        image_path = save_image(main_image)
    product = Product(
        name=name,
        sku=sku,
        price=price,
        brand_id=brand_id,
        category_id=category_id,
        description=description,
        color=color,
        width=width,
        height=height,
        depth=depth,
        weight=weight,
        main_image=image_path,
    )
    session.add(product)
    await session.commit()
    return RedirectResponse(url="/admin-custom/products", status_code=303)

@router.get("/products/edit/{product_id}", response_class=HTMLResponse)
async def product_edit_form(
    request: Request,
    product_id: int,
    session: AsyncSession = Depends(get_db)
):
    product = await session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    brands = (await session.execute(select(Brand).order_by(Brand.name))).scalars().all()
    # ★★★ ТОЛЬКО КАТЕГОРИИ 3-ГО УРОВНЯ ★★★
    categories = (await session.execute(
        select(Category).where(Category.level == 3).order_by(Category.name)
    )).scalars().all()
    template = templates.get_template("admin/product_edit.html")
    content = template.render(
        request=request,
        product=product,
        brands=brands,
        categories=categories,
    )
    return HTMLResponse(content)

@router.post("/products/edit/{product_id}")
async def product_edit(
    product_id: int,
    name: str = Form(...),
    sku: str = Form(None),
    price: float = Form(None),
    brand_id: int = Form(None),
    category_id: int = Form(None),
    description: str = Form(None),
    color: str = Form(None),
    width: float = Form(None),
    height: float = Form(None),
    depth: float = Form(None),
    weight: float = Form(None),
    main_image: UploadFile = File(None),
    session: AsyncSession = Depends(get_db)
):
    product = await session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")
    product.name = name
    product.sku = sku
    product.price = price
    product.brand_id = brand_id
    product.category_id = category_id
    product.description = description
    product.color = color
    product.width = width
    product.height = height
    product.depth = depth
    product.weight = weight
    if main_image and main_image.filename:
        if product.main_image:
            old = product.main_image.replace("/uploads/products/", "")
            old_path = os.path.join(UPLOAD_DIR, old)
            if os.path.exists(old_path):
                os.remove(old_path)
        product.main_image = save_image(main_image)
    await session.commit()
    return RedirectResponse(url="/admin-custom/products", status_code=303)

@router.get("/products/delete/{product_id}")
async def product_delete(
    product_id: int,
    session: AsyncSession = Depends(get_db)
):
    product = await session.get(Product, product_id)
    if product:
        if product.main_image:
            old = product.main_image.replace("/uploads/products/", "")
            old_path = os.path.join(UPLOAD_DIR, old)
            if os.path.exists(old_path):
                os.remove(old_path)
        await session.delete(product)
        await session.commit()
    return RedirectResponse(url="/admin-custom/products", status_code=303)