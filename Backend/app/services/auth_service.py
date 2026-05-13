from sqlalchemy.orm import Session
from ..models.user import User
from ..models.schemas import UserRegister
from ..utils.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException, status

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

        # ВАЖНО: преобразуем UUID в строку для JWT
        token = create_access_token({"sub": user.email, "user_id": str(user.id)})

        return {
            "access_token": token,
            "user": {
                "id": str(user.id),  # UUID в строку
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

        # ВАЖНО: преобразуем UUID в строку для JWT
        token = create_access_token({"sub": user.email, "user_id": str(user.id)})

        return {
            "access_token": token,
            "user": {
                "id": str(user.id),  # UUID в строку
                "name": user.name,
                "email": user.email
            }
        }