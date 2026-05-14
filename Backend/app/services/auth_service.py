# services/auth_service.py
from sqlalchemy.orm import Session
from ..models.user import User
from ..models.schemas import UserRegister
from ..utils.security import hash_password, verify_password, create_access_token, decode_access_token, get_current_user_from_token
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..database import get_db

security = HTTPBearer()

class AuthService:
    @staticmethod
    def register(db: Session, user_data: UserRegister) -> dict:
        existing = db.query(User).filter(User.email == user_data.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Пользователь с таким email уже существует"
            )

        user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hash_password(user_data.password)
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token({"sub": user.email, "user_id": str(user.id)})

        return {
            "access_token": token,
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            }
        }

    @staticmethod
    def login(db: Session, email: str, password: str) -> dict:
        user = db.query(User).filter(User.email == email).first()

        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Аккаунт деактивирован"
            )

        token = create_access_token({"sub": user.email, "user_id": str(user.id)})

        return {
            "access_token": token,
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            }
        }

    @staticmethod
    def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: Session = Depends(get_db)
    ) -> User:
        """
        Получение текущего пользователя из JWT токена
        """
        token = credentials.credentials
        user = get_current_user_from_token(token, db)  # Используем новую функцию
        return user