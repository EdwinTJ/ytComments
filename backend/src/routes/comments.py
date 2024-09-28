# routers/comments.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.dependencies import get_db
from schemas.schemas import CommentSummarizeRequest
from youtube import get_video_comments
from open_ai import summarize_comments
from auth.auth import get_current_user
from database.models import User

router = APIRouter()

# Summarize video comments
@router.post("/summarize_comments/")
async def summarize_video_comments(request: CommentSummarizeRequest, user: User = Depends(get_current_user)):
    comments = get_video_comments(request.video_id)
    if not comments:
        raise HTTPException(status_code=404, detail="No comments found")

    summary = summarize_comments(comments, request.prompt)
    return {"summary": summary}
