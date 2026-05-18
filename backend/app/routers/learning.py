from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.models.learning import LearningProgress
from app.security import get_current_user

router = APIRouter(prefix="/learning", tags=["Learning"])


class LearningProgressCreate(BaseModel):
    domain: str
    resource_type: str
    resource_name: str


class LearningProgressUpdate(BaseModel):
    progress: int = None
    completed: bool = None


class LearningProgressResponse(BaseModel):
    id: int
    domain: str
    resource_type: str
    resource_name: str
    progress: int
    completed: bool

    class Config:
        from_attributes = True


@router.get("/{domain}", response_model=List[LearningProgressResponse])
def get_learning_by_domain(
    domain: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user["user_id"],
        LearningProgress.domain == domain
    ).all()


@router.post("", response_model=LearningProgressResponse)
def create_learning_progress(
    data: LearningProgressCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_progress = LearningProgress(
        user_id=current_user["user_id"],
        **data.model_dump()
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return new_progress


@router.put("/{item_id}", response_model=LearningProgressResponse)
def update_learning_progress(
    item_id: int,
    data: LearningProgressUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(LearningProgress).filter(
        LearningProgress.id == item_id,
        LearningProgress.user_id == current_user["user_id"]
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if data.progress is not None:
        item.progress = min(100, max(0, data.progress))
        if item.progress == 100:
            item.completed = True
    if data.completed is not None:
        item.completed = data.completed

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def delete_learning_progress(
    item_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(LearningProgress).filter(
        LearningProgress.id == item_id,
        LearningProgress.user_id == current_user["user_id"]
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}