from pathlib import Path

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from .database import engine, Base, async_engine
from .routers import (
    auth,
    products_homeier,
    orders,
    products_brandt,
    products_all,
    categories,
    users,
    products_liebherr,
    products_dedietrich,
    products_nivona,
    products_kuppersbusch,
    products_schulthess,
    products_graude,
    products_bonkrasher,
    products_teka,
    products_falmec
)
from .config import settings
from .models import User, Category, Brand, Order, HomeierProduct
from .admin import setup_admin

UPLOAD_DIR = Path("uploads/products")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

Base.metadata.create_all(bind=engine)

security = HTTPBearer()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    debug=settings.DEBUG,
    swagger_ui_parameters={
        "persistAuthorization": True,
    }
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

# ВАЖНО: используем одинаковый секретный ключ для сессий
app.add_middleware(SessionMiddleware, secret_key="your-very-long-secret-key-for-sessions-2025-12345")

app.mount("/uploads/products", StaticFiles(directory="static/uploads/products"), name="product_images")

app.include_router(auth.router)
app.include_router(products_homeier.router)
app.include_router(orders.router)
app.include_router(products_brandt.router)
app.include_router(products_all.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(products_liebherr.router)
app.include_router(products_dedietrich.router)
app.include_router(products_nivona.router)
app.include_router(products_kuppersbusch.router)
app.include_router(products_schulthess.router)
app.include_router(products_graude.router)
app.include_router(products_bonkrasher.router)
app.include_router(products_teka.router)
app.include_router(products_falmec.router)

setup_admin(app, async_engine)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": settings.API_VERSION,
        "environment": "production" if not settings.DEBUG else "development"
    }