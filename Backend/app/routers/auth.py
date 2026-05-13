from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schemas import UserRegister, UserLogin
from ..services.auth_service import AuthService

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    return AuthService.register(db, user_data)

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    return AuthService.login(db, user_data.email, user_data.password)

@router.post("/logout")
def logout():
    return {"message": "выход успешный"}