from fastapi import FastAPI, HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from youtube import get_video_comments, get_channel_videos
from open_ai import summarize_comments

from sqlalchemy.orm import Session
from database.dependencies import get_db
from database.models import User,ChannelInfo

import os
from dotenv import load_dotenv
load_dotenv()

# Environment variables
YOUTUBE_API_KEY = os.environ['YOUTUBE_API_KEY']
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class ChannelCreate(BaseModel):
    channel_id: str
    user_id: int

class CommentSummarizeRequest(BaseModel):
    video_id: str
    prompt: str

class ChannelVideosRequest(BaseModel):
    channel_id: str

# API Endpoints

# 0. Root endpoint
@app.get("/")
async def read_root():
    return {"Hello": "World"}

# 1. Summarize video comments
@app.post("/summarize_comments/")
async def summarize_video_comments(request: CommentSummarizeRequest):
    comments = get_video_comments(request.video_id)
    
    if not comments:
        raise HTTPException(status_code=404, detail="No comments found")
    
    summary = summarize_comments(comments, request.prompt)
    return {"summary": summary}

# 2. Get channel videos
@app.post("/channel_videos/")
async def get_videos_from_channel(request: ChannelVideosRequest):
    videos = get_channel_videos(request.channel_id)
    
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found")
    
    return {"videos": videos}

# 3. User CRUD
@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name, email=user.email,password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 4. Read user
@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return user

# 5. Create channel
@app.post("/users/{user_id}/channels/")
def add_channel(user_id: int, channel: ChannelCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}

    new_channel = ChannelInfo(channel_id=channel.channel_id, owner=user)
    db.add(new_channel)
    db.commit()
    db.refresh(new_channel)
    return new_channel