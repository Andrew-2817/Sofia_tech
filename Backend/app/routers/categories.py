from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import asc

from ..database import get_db
from ..models.category import Category
from ..models.schemas import CategoryResponse

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("/", response_model=List[CategoryResponse])
def get_all_categories(db: Session = Depends(get_db)):
    """Получить все категории"""
    categories = db.query(Category).order_by(asc(Category.sort_order)).all()
    return categories

class CategoryTreeResponse(BaseModel):
    id: int
    name: str
    slug: str
    level: int
    sort_order: int
    parent_id: Optional[int] = None
    children: List['CategoryTreeResponse'] = []
    
    class Config:
        from_attributes = True

# Для рекурсивных моделей Pydantic
CategoryTreeResponse.model_rebuild()

def build_category_tree(categories: List[Category], parent_id: Optional[int] = None) -> List[dict]:
    """Построить дерево категорий"""
    tree = []
    for category in categories:
        if category.parent_id == parent_id:
            node = {
                "id": category.id,
                "name": category.name,
                "slug": category.slug,
                "level": category.level,
                "sort_order": category.sort_order,
                "parent_id": category.parent_id,
                "children": build_category_tree(categories, category.id)
            }
            tree.append(node)
    
    # Сортировка по sort_order
    tree.sort(key=lambda x: x["sort_order"])
    return tree

@router.get("/tree", response_model=List[CategoryTreeResponse])
def get_categories_tree(db: Session = Depends(get_db)):
    """Получить все категории в виде дерева"""
    categories = db.query(Category).order_by(asc(Category.sort_order)).all()
    tree = build_category_tree(categories)
    return tree