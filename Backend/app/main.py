from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base, async_engine
from .routers import auth, orders, categories, users
from .routers import products_brandt, products_bonkrasher, products_dedietrich, products_falmec, products_graude, products_homeier, products_ilve, products_kuppersbusch, products_liebherr, products_nivona, products_schulthess, products_teka, products_elica, products, brands
from .routers.admin_products import router as admin_products_router
from .config import settings
from .models import User, Category, Brand, Order, Product
from .admin import setup_admin

UPLOAD_DIR = Path("uploads/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    debug=settings.DEBUG,
)

if settings.DEBUG:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://yourdomain.com"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
        allow_headers=["Authorization", "Content-Type"],
    )

app.add_middleware(SessionMiddleware, secret_key="your-very-long-secret-key-for-sessions-2025-12345")

app.mount("/uploads/products", StaticFiles(directory="static/uploads/products"), name="product_images")

app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(admin_products_router)      # <-- кастомная админка товаров
app.include_router(products_brandt.router)
app.include_router(products_bonkrasher.router)
app.include_router(products_dedietrich.router)
app.include_router(products_falmec.router)
app.include_router(products_graude.router)
app.include_router(products_homeier.router)
app.include_router(products_ilve.router)
app.include_router(products_kuppersbusch.router)
app.include_router(products_liebherr.router)
app.include_router(products_nivona.router)
app.include_router(products_schulthess.router)
app.include_router(products_teka.router)
app.include_router(products_elica.router)
app.include_router(products.router)
app.include_router(brands.router)

setup_admin(app, async_engine)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": settings.API_VERSION}