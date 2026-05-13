from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from .database import engine, Base
from .routers import auth, products_homeier, orders, products_brandt, products_all
from .config import settings
from .models import User, Category, Brand, Order, HomeierProduct

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

# Настройка Bearer авторизации для Swagger
security = HTTPBearer()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    debug=settings.DEBUG,
    swagger_ui_parameters={
        "persistAuthorization": True,  # Сохранять авторизацию
    }
)

# Настройка CORS
if settings.DEBUG:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,  # Важно: true для авторизации
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

# Подключаем роутеры
app.include_router(auth.router)
app.include_router(products_homeier.router)
app.include_router(orders.router)
app.include_router(products_brandt.router)
app.include_router(products_all.router)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": settings.API_VERSION,
        "environment": "production" if not settings.DEBUG else "development"
    }