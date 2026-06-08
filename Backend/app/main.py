from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base, async_engine
from .routers import auth, orders, categories, users
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

setup_admin(app, async_engine)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": settings.API_VERSION}