# routers/user.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

from ..utils.dependencies import get_current_user

from ..database import get_db
from ..models.user import User

router = APIRouter(prefix="/api/user", tags=["user"])

# Схемы для ответов и запросов
class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserUpdateResponse(BaseModel):
    message: str
    user: UserResponse


# ============================================
# ЭНДПОИНТ 1: ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
# ============================================
@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получение всех данных пользователя для личного кабинета
    """
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        address=current_user.address,
        is_active=current_user.is_active,
        is_admin=current_user.is_admin,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )


# ============================================
# ЭНДПОИНТ 2: ИЗМЕНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
# ============================================
@router.put("/profile", response_model=UserUpdateResponse)
async def update_user_profile(
    user_data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Изменение данных пользователя в личном кабинете
    """
    # Проверка уникальности email (если меняется)
    if user_data.email and user_data.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")
        current_user.email = user_data.email
    
    # Обновляем только переданные поля
    if user_data.name is not None:
        current_user.name = user_data.name
    
    if user_data.phone is not None:
        current_user.phone = user_data.phone
    
    if user_data.address is not None:
        current_user.address = user_data.address
    
    # Обновляем время изменения
    current_user.updated_at = datetime.now()
    
    db.commit()
    db.refresh(current_user)
    
    return UserUpdateResponse(
        message="Profile updated successfully",
        user=UserResponse(
            id=current_user.id,
            name=current_user.name,
            email=current_user.email,
            phone=current_user.phone,
            address=current_user.address,
            is_active=current_user.is_active,
            is_admin=current_user.is_admin,
            created_at=current_user.created_at,
            updated_at=current_user.updated_at
        )
    )