import warnings
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status  # Добавь это
from ..config import settings

# Игнорируем предупреждение bcrypt
warnings.filterwarnings("ignore", category=UserWarning, module="passlib.handlers.bcrypt")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Хэширование пароля bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """Создание JWT токена"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict:
    """Декодирование JWT токена"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def verify_token_and_get_user(token: str, db: Session):
    """Проверка токена и получение пользователя"""
    from ..models.user import User

    # Декодируем токен
    payload = decode_access_token(token)
    if not payload:
        return None

    # Проверяем не истек ли токен
    exp = payload.get("exp")
    if exp and datetime.fromtimestamp(exp) < datetime.utcnow():  # Исправлено: убран utcfromtimestamp
        return None

    user_id = payload.get("user_id")
    if not user_id:
        return None

    user = db.query(User).filter(User.id == user_id).first()
    return user

# ========== ДОБАВЬ ЭТИ ФУНКЦИИ ДЛЯ УДОБСТВА ==========

def get_current_user_from_token(token: str, db: Session):
    """Получение текущего пользователя из токена с выбросом HTTP исключения"""
    user = verify_token_and_get_user(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный или просроченный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user