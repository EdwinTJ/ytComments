from googleapiclient.discovery import build
from dotenv import load_dotenv
from openai import OpenAI
import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# Load the environment variables
load_dotenv() 
YOUTUBE_API_KEY = os.environ['YOUTUBE_API_KEY']
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']
YOUTUBE_API_SERVICE_NAME = os.environ['YOUTUBE_API_SERVICE_NAME']
YOUTUBE_API_VERSION = os.environ['YOUTUBE_API_VERSION']

app = FastAPI()

class CommentSummarizeRequest(BaseModel):
    video_id: str
    prompt: str

class ChannelVideosRequest(BaseModel):
    channel_id: str

def get_video_comments(video_id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_API_KEY)

    # Get the comments
    response = youtube.commentThreads().list(
    part="snippet",
    videoId=video_id,
    maxResults=40  # Adjust as needed
    ).execute()

    # Extract the comments, and store them in a list
    comments = []
    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
        comments.append(comment)

    return comments


def summarize_comments(comments, prompt):
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    # Join the comments into a single string
    comments_text = "\n".join(comments)

    new_prompt = f"{prompt}\n\nComments:\n{comments_text}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": new_prompt},
        ],
        #max_tokens=200,Adjust based on the length of summary you want
        temperature=1.3,# Adjust for creativity in the response
        
    )
    # Generate the summary
    summary = response.choices[0].message.content
    return summary


def get_channel_videos(channel_id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_API_KEY)

    # Fetch the videos from the channel
    response = youtube.search().list(
        channelId=channel_id,
        part='id,snippet',
        maxResults=10,
        order='date'
    ).execute()

    # 
    videos =[]
    for item in response['items']:
        video_data = {
            'title': item['snippet']['title'],
            'videoId': item['id']['videoId'],
            'thumbnail': item['snippet']['thumbnails']['high']['url'],
            'description': item['snippet']['description']
        }
        videos.append(video_data)

    return videos

# API Endpoints

# 1. Summarize video comments
@app.post("/summarize_comments/")
def summarize_video_comments(request: CommentSummarizeRequest):
    comments = get_video_comments(request.video_id)
    
    if not comments:
        raise HTTPException(status_code=404, detail="No comments found")
    
    summary = summarize_comments(comments, request.prompt)
    return {"summary": summary}

# 2. Get channel videos
@app.post("/channel_videos/")
def get_videos_from_channel(request: ChannelVideosRequest):
    videos = get_channel_videos(request.channel_id)
    
    if not videos:
        raise HTTPException(status_code=404, detail="No videos found")
    
    return {"videos": videos}

@app.get("/")
def read_root():
    return {"Hello": "World"}