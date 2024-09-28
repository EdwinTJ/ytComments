# routers/channels.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.dependencies import get_db
from database.models import User, ChannelInfo
from schemas.schemas import ChannelCreate,ChannelVideosRequest
from auth.auth import get_current_user
from youtube import get_channel_videos

router = APIRouter()

# Create channel
@router.post("/{user_id}/channels/", response_model=ChannelCreate)
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

# Read all channels for a user
@router.get("/{user_id}/channels/")
def read_channels(user_id: int, db: Session = Depends(get_db)):
    channels = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id).all()
    if not channels:
        raise HTTPException(status_code=404, detail="No channels found for this user")
    return channels

# Read a specific channel
@router.get("/{user_id}/channels/{channel_id}")
def read_channel(user_id: int, channel_id: int, db: Session = Depends(get_db)):
    channel = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id, ChannelInfo.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel

# Update channel
@router.put("/{user_id}/channels/{channel_id}")
def update_channel(user_id: int, channel_id: int, channel_update: ChannelCreate, db: Session = Depends(get_db)):
    channel = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id, ChannelInfo.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    channel.channel_id = channel_update.channel_id
    db.commit()
    db.refresh(channel)
    return channel

# Delete channel
@router.delete("/{user_id}/channels/{channel_id}")
def delete_channel(user_id: int, channel_id: int, db: Session = Depends(get_db)):
    channel = db.query(ChannelInfo).filter(ChannelInfo.user_id == user_id, ChannelInfo.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    db.delete(channel)
    db.commit()
    return {"message": "Channel deleted successfully"}

@router.post("/channel_videos/")
async def get_videos_from_channel(request: ChannelVideosRequest, user: User = Depends(get_current_user)):
    print(f"Fetching videos: {request} \n") 
    channel_id_strip = request.channel_id.strip()
    videos = get_channel_videos(channel_id_strip)
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found")
    return {"videos": videos}