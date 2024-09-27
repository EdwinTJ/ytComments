from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: int

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class ChannelCreate(BaseModel):
    channel_id: str

class CommentSummarizeRequest(BaseModel):
    video_id: str
    prompt: str

class ChannelVideosRequest(BaseModel):
    channel_id: str