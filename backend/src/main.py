from fastapi import FastAPI, HTTPException, Request,Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
from pydantic import BaseModel
from datetime import datetime
# OpenAI
import openai
from open_ai import summarize_comments as openai_summarize_comments
# New import for YouTube functions
from youtube import get_video_comments, get_channel_videos
# Load environment variables
from config import (
    SESSION_SECRET_KEY,
    GOOGLE_REDIRECT_URI,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID,
)
# DB
from database.models import User
from sqlalchemy.orm import Session
from database.dependencies import get_db
from databases import Database

#### FASTAPI INIT ####

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)
######
class UserData(BaseModel):
    name: str
    email: str
    channel_id: str
    access_token: str
    refresh_token: str
    token_expiry: datetime
#### DATABASE ########
DATABASE_URL = "postgresql://admin:admin@localhost/projectyt"

database = Database(DATABASE_URL)
# Update your FastAPI app setup
app.add_event_handler("startup", database.connect)
app.add_event_handler("shutdown", database.disconnect)

################################
### DB Operations#####
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
###################


import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # Allow HTTP traffic for local dev

SCOPES = [
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid"
]

flow = Flow.from_client_config(
    client_config={
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uris": [GOOGLE_REDIRECT_URI],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token"
        }
    },
    scopes=SCOPES,
    redirect_uri=GOOGLE_REDIRECT_URI
)



user_data_store = {} 

@app.get("/auth/login")
def login_with_google():
    authorization_url, state = flow.authorization_url(access_type="offline", include_granted_scopes="true")
    return RedirectResponse(authorization_url)

@app.get("/auth/callback")
async def auth_callback(code: str, db: Session = Depends(get_db)):
    flow.fetch_token(code=code)
    credentials = flow.credentials

    user_info_service = build("oauth2", "v2", credentials=credentials)
    user_info = user_info_service.userinfo().get().execute()

    email = user_info["email"]
    name = user_info["name"]

    youtube_service = build("youtube", "v3", credentials=credentials)
    channel_response = youtube_service.channels().list(mine=True, part="snippet,contentDetails").execute()
    if not channel_response.get("items"):
        raise HTTPException(status_code=404, detail="No YouTube channel found")

    channel_id = channel_response["items"][0]["id"]
    user = await get_user_by_email(db, email)
    if user:
        print(f"user exists \n")
        user = await update_user_token(db, user, credentials.token, credentials.expiry)
        print(user)
        print(f"\n")
    else:
        print(f"user data else \n")
        user_data = UserData(
            name=name,
            email=email,
            channel_id=channel_id,
            access_token=credentials.token,
            refresh_token=credentials.refresh_token,
            token_expiry=credentials.expiry
        )
        user = await create_user(db, user_data)

    redirect_url = f"http://localhost:5173/?name={user.name}&email={user.email}&channel_id={user.channel_id}&access_token={user.access_token}&refresh_token={user.refresh_token}"
    return RedirectResponse(redirect_url)

#######
def refresh_access_token(refresh_token):
    credentials = Credentials(
        token=None,
        refresh_token=refresh_token,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token"
    )        
    
    credentials.refresh(GoogleRequest())
    return credentials.token, credentials.expiry

async def get_user_by_refresh_token(db: Session, refresh_token: str):
    return db.query(User).filter(User.refresh_token == refresh_token).first()
#####
@app.post("/api/refresh_token")
async def refresh_token(request: Request, db: Session = Depends(get_db)):
    logger.info("Entering /api/refresh_token endpoint")
    body = await request.json()
    refresh_token = body.get("refresh_token")
    if not refresh_token:
        logger.error("Refresh token is required")
        raise HTTPException(status_code=400, detail="Refresh token is required")
    
    try:
        credentials = Credentials(
            token=None,
            refresh_token=refresh_token,
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            token_uri="https://oauth2.googleapis.com/token"
        )
        credentials.refresh(GoogleRequest())
        
        user = await get_user_by_refresh_token(db, refresh_token)
        if user:
            user = await update_user_token(db, user, credentials.token, credentials.expiry)
            logger.info(f"Token refreshed for user: {user.email}")
        else:
            logger.error("User not found for the given refresh token")
            raise HTTPException(status_code=404, detail="User not found")
        return JSONResponse(content={"access_token": credentials.token})

    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        raise HTTPException(status_code=400, detail="Token refresh failed")
    
@app.get("/api/videos")
async def get_videos(request: Request, db: Session = Depends(get_db)):
    logger.info("Entering /api/videos endpoint")
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        logger.error("Invalid or missing token")
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    token = auth_header.split(" ")[1]
    logger.info(f"Received token: {token[:10]}...")
    user = await get_user_by_token(db, token)
    
    if not user:
        logger.error("Invalid token - user not found")
        raise HTTPException(status_code=401, detail="Invalid token")

    logger.info(f"User found: {user.email}")

    # Check if token is expired
    if datetime.utcnow() > user.token_expiry:
        logger.error("Token expired")
        raise HTTPException(status_code=401, detail="Token expired")

    try:
        videos = get_channel_videos(user.channel_id)
        if not videos:
            logger.warning("No videos found or error occurred")
            return JSONResponse(content={"videos": [], "message": "No videos found or error occurred"})
        logger.info(f"Successfully fetched {len(videos)} videos")
        return JSONResponse(content={"videos": videos})
    except Exception as e:
        logger.error(f"Error fetching videos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch videos: {str(e)}")


@app.get("/api/user")
async def get_user_info(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    token = auth_header.split(" ")[1]
    user = await get_user_by_token(db, token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return JSONResponse(content={
        "name": user.name,
        "email": user.email,
        "channel_id": user.channel_id
    })

@app.get("/api/video/{video_id}/comments")
async def get_comments(video_id: str, request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    token = auth_header.split(" ")[1]
    user = await get_user_by_token(db, token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        comments = get_video_comments(video_id)
        return JSONResponse(content={"comments": comments})
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to fetch comments")

@app.post("/api/summarize_comments")
async def summarize_comments(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    
    token = auth_header.split(" ")[1]
    user = await get_user_by_token(db, token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    body = await request.json()
    video_id = body.get("video_id")
    prompt = body.get("prompt")

    if not video_id or not prompt:
        raise HTTPException(status_code=400, detail="Missing video_id or prompt")

    try:
        # Fetch comments
        comments = get_video_comments(video_id)

        if not comments:
            return JSONResponse(content={"summary": "No comments found for this video."})

        # Summarize comments
        try:
            summary = openai_summarize_comments(comments, prompt)
            return JSONResponse(content={"summary": summary})
        except openai.APIError as e:
            print(f"OpenAI API error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
        except Exception as e:
            print(f"Error in summarize_comments: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error in summarize_comments: {str(e)}")
    except HttpError as e:
        if e.resp.status == 403 and "insufficientPermissions" in str(e):
            raise HTTPException(status_code=403, detail="Insufficient authentication scopes. Please log in again.")
        raise HTTPException(status_code=400, detail=f"YouTube API error: {str(e)}")
    except Exception as e:
        print(f"Error in summarize_comments endpoint: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to summarize comments: {str(e)}")

@app.get("/logout")
async def logout(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        user = await get_user_by_token(db, token)
        if user:
            # You might want to invalidate the token here or perform any other cleanup
            pass
    return JSONResponse(content={"message": "Logged out successfully"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000, log_level="debug")