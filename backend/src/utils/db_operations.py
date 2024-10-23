from sqlalchemy.orm import Session
from src.database.models import User
from datetime import datetime
from src.utils.schemas import UserData

async def create_user(db: Session, user:UserData):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

async def get_user_by_token(db: Session, token: str):
    return db.query(User).filter(User.access_token == token).first()

async def update_user_token(db: Session, user: User, access_token: str, token_expiry: datetime):
    user.access_token = access_token
    user.token_expiry = token_expiry
    db.commit()
    db.refresh(user)
    return user

async def get_user_by_refresh_token(db: Session, refresh_token: str):
    return db.query(User).filter(User.refresh_token == refresh_token).first()