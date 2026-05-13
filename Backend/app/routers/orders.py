from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid
import json
from ..database import get_db
from ..models.order import Order
from ..models.user import User
from ..models.schemas import OrderCreate, OrderUpdate, OrderResponse
from ..utils.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/orders", tags=["orders"])

# Создать заказ (только для авторизованных пользователей)
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Убрали Optional, теперь обязательная авторизация
):
    # Генерируем уникальный номер заказа
    order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"

    # Преобразуем items в JSON строку
    items_json = json.dumps(order_data.items)

    order = Order(
        order_number=order_number,
        user_id=str(current_user.id),  # Теперь всегда есть пользователь
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        customer_address=order_data.customer_address,
        items=items_json,
        total_amount=order_data.total_amount,
        status="pending",
        customer_comment=order_data.customer_comment
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # Для ответа преобразуем items обратно в список словарей
    order.items = json.loads(order.items)

    return order

# Получить все заказы (только для админа)
@router.get("/", response_model=List[OrderResponse])
def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.status == status_filter)

    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

    # Преобразуем items из JSON строки в список словарей для каждого заказа
    for order in orders:
        order.items = json.loads(order.items)

    return orders

# Получить заказы текущего пользователя
@router.get("/my", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = db.query(Order).filter(Order.user_id == str(current_user.id)).order_by(Order.created_at.desc()).all()

    # Преобразуем items из JSON строки в список словарей для каждого заказа
    for order in orders:
        order.items = json.loads(order.items)

    return orders

# Получить заказ по ID (UUID)
@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # Проверка прав: админ или владелец заказа
    if not current_user.is_admin and order.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    # Преобразуем items из JSON строки в список словарей
    order.items = json.loads(order.items)

    return order

# Получить заказ по номеру
@router.get("/number/{order_number}", response_model=OrderResponse)
def get_order_by_number(
    order_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    if not current_user.is_admin and order.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    # Преобразуем items из JSON строки в список словарей
    order.items = json.loads(order.items)

    return order

# Обновить заказ (для админа или владельца)
@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: str,
    order_data: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    # Обычный пользователь может обновить только свои данные
    if not current_user.is_admin and order.user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    # Обычный пользователь не может менять статус
    if not current_user.is_admin and order_data.status:
        raise HTTPException(status_code=403, detail="Нельзя менять статус заказа")

    for key, value in order_data.model_dump(exclude_unset=True).items():
        if key == 'items' and value:
            value = json.dumps(value)
        setattr(order, key, value)

    db.commit()
    db.refresh(order)

    # Преобразуем items из JSON строки в список словарей
    order.items = json.loads(order.items)

    return order

# Обновить статус заказа (только для админа)
@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    allowed_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    if status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Недопустимый статус. Допустимые: {allowed_statuses}")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    order.status = status
    db.commit()
    db.refresh(order)

    # Преобразуем items из JSON строки в список словарей
    order.items = json.loads(order.items)

    return order

# Удалить заказ (только для админа)
@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Недостаточно прав")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    db.delete(order)
    db.commit()
    return None