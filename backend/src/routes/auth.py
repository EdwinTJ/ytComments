# routers/auth.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import timedelta
from database.models import User
from database.dependencies import get_db
from schemas.schemas import Token
from auth.auth import verify_password, create_access_token
from config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

# Login route (token generation)
@router.post("/token/", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"user_id": user.id, "email": user.email}, expires_delta=access_token_expires)
    print(f"Access token created {access_token}")
    return {"access_token": access_token, "token_type": "bearer"}

# Logout route (dummy implementation)
@router.post("/logout/")
def logout(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    return {"message": "Successfully logged out"}
