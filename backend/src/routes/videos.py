# routers/videos.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.dependencies import get_db
from schemas.schemas import ChannelVideosRequest
from youtube import get_channel_videos
from auth.auth import get_current_user
from database.models import User
import logging

router = APIRouter()

# Get videos from channel
@router.post("/channel_videos/")
async def get_videos_from_channel(request: ChannelVideosRequest, user: User = Depends(get_current_user)):
    print(f"Fetching videos: {request} \n") 
    logging.info(f"User: {user.email}, Channel ID: {request.channel_id}")

    channel_id_strip = request.channel_id.strip()
    videos = get_channel_videos(channel_id_strip)
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found")
    return {"videos": videos}
