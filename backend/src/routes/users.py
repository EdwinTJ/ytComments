# routers/users.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.dependencies import get_db
from database.models import User
from schemas.schemas import UserCreate
from auth.auth import hash_password

router = APIRouter()

# Create user
@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Read user
@router.get("/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
