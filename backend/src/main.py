from fastapi import FastAPI, HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware

from youtube import get_video_comments, get_channel_videos
from open_ai import summarize_comments

from sqlalchemy.orm import Session
from database.dependencies import get_db


#JWT
from datetime import timedelta
from auth.auth import hash_password,verify_password,create_access_token,verify_token,get_current_user,oauth2_scheme

# Schemas
from database.models import User,ChannelInfo
from schemas.schemas import Token,UserCreate,ChannelCreate,CommentSummarizeRequest,ChannelVideosRequest
# Environment variables
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import  OAuth2PasswordRequestForm,OAuth2PasswordBearer

###
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# API Endpoints

# 0. Root endpoint
@app.get("/")
async def read_root():
    return {"Hello": "World"}

# 6. Token generation
@app.post("/token/", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Send user info: user.id
    access_token = create_access_token(data={"user_id": user.id}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

# Get Current User
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# 1. Summarize video comments
@app.post("/summarize_comments/")
async def summarize_video_comments(request: CommentSummarizeRequest, user: User = Depends(get_current_user)):
    print(f"Request received: {request}")  
    comments = get_video_comments(request.video_id)
    
    if not comments:
        raise HTTPException(status_code=404, detail="No comments found")
    
    summary = summarize_comments(comments, request.prompt)
    return {"summary": summary}

# 2. Get channel videos
@app.post("/channel_videos/")
async def get_videos_from_channel(request: ChannelVideosRequest, user: User = Depends(get_current_user)):
    channel_id_strip = request.channel_id.strip()

    videos = get_channel_videos(channel_id_strip)
    
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found")
    
    return {"videos": videos}

# 3. User CRUD
@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 4. Read user
@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return user

######## Channel ######
# 1. Create Channel
@app.post("/users/{user_id}/channels/", response_model=ChannelCreate)
def create_channel(user_id: int, channel: ChannelCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    channel_id_strip = channel.channel_id.strip()
    new_channel = ChannelInfo(channel_id=channel_id_strip, user_id=user.id)
    db.add(new_channel)
    db.commit()
    db.refresh(new_channel)
    return new_channel

# 2. Read Channels (list all channels for a user)
@app.get("/users/{user_id}/channels/")
def read_channels(user_id: int, db: Session = Depends(get_db)):
    # print(f"Fetching channels for user_id: {user_id}")  # Debug print
    channels = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id).all()
    if not channels:
        raise HTTPException(status_code=404, detail="No channels found for this user")
    return channels

# 3. Read a specific channel by channel ID
@app.get("/users/{user_id}/channels/{channel_id}")
def read_channel(user_id: int, channel_id: int, db: Session = Depends(get_db)):
    channel = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id, ChannelInfo.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel

# 4. Update Channel
@app.put("/users/{user_id}/channels/{channel_id}")
def update_channel(user_id: int, channel_id: int, channel_update: ChannelCreate, db: Session = Depends(get_db)):
    channel = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id, ChannelInfo.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    # Update channel fields
    channel.channel_id = channel_update.channel_id
    db.commit()
    db.refresh(channel)
    return channel

# 5. Delete Channel
@app.delete("/users/{user_id}/channels/{channel_id}")
def delete_channel(user_id: int, channel_id: int, db: Session = Depends(get_db)):
    channel = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id, ChannelInfo.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    db.delete(channel)
    db.commit()
    return {"message": "Channel deleted successfully"}
###############


# 7. Logout
@app.post("/logout/")
def logout(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    return {"message": "Successfully logged out"}


