# routers/auth.py

from fastapi import APIRouter, HTTPException, Depends,Request
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import timedelta
from database.models import User
from database.dependencies import get_db
from schemas.schemas import Token
from auth.auth import verify_password, create_access_token
from config import ACCESS_TOKEN_EXPIRE_MINUTES
import google.oauth2.credentials
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
router = APIRouter()
CLIENT_SECRETS_FILE = "client_secret.json"
SCOPES = ['https://www.googleapis.com/auth/youtube.readonly','https://www.googleapis.com/auth/youtube.force-ssl']

# Set up OAuth 2.0 flow configuration
flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=SCOPES,
    redirect_uri="http://127.0.0.1:8000/auth/oauth2callback"
)

@router.get("/authorize")
def authorize_google():
    print("Google")
    authorization_url, state = flow.authorization_url(
        access_type='offline', include_granted_scopes='true'
    )
    print(f"Authorization URL: {authorization_url}")
    return RedirectResponse(authorization_url)
# 2. Callback Route

@router.get("/oauth2callback")
async def oauth2callback(request: Request):  # Define Request type
    print(f"Callback: {request.url}")
    
    # Use the full URL as the authorization response
    flow.fetch_token(authorization_response=str(request.url))
    
    # Retrieve credentials from the flow object
    credentials = flow.credentials
    
    # Store the credentials (e.g., in a database or session)
    print(f"Credentials: {credentials}")
    
    token_info = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

    # Use the credentials to access the YouTube API
    service = build('youtube', 'v3', credentials=credentials)
    response = service.channels().list(part='snippet', mine=True).execute()

    # Handle the YouTube response
    channel_info = response['items'][0]['snippet']
    
    # Create a JWT token and return it
    access_token = create_access_token(data={"sub": channel_info['title']})
    
    return {"access_token": access_token, "channel_info": channel_info}


# Login route (token generation)
@router.post("/token/", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"user_id": user.id, "email": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# Logout route (dummy implementation)
@router.post("/logout/")
def logout(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    return {"message": "Successfully logged out"}
