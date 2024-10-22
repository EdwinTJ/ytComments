from pydantic import BaseModel
from datetime import datetime


class UserData(BaseModel):
    name: str
    email: str
    channel_id: str
    access_token: str
    refresh_token: str
    token_expiry: datetime