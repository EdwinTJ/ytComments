from googleapiclient.discovery import build

from dotenv import load_dotenv
import os

# Load the environment variables
load_dotenv() 
YOUTUBE_API_KEY = os.environ['YOUTUBE_API_KEY']
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']
YOUTUBE_API_SERVICE_NAME = os.environ['YOUTUBE_API_SERVICE_NAME']
YOUTUBE_API_VERSION = os.environ['YOUTUBE_API_VERSION']


def get_video_comments(video_id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_API_KEY)

    # Get the comments
    response = youtube.commentThreads().list(
    part="snippet",
    videoId=video_id,
    maxResults=50  # Adjust as needed
    ).execute()

    # Extract the comments, and store them in a list
    comments = []
    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
        comments.append(comment)

    return comments

if __name__ == '__main__':
    video_id = 'dQw4w9WgXcQ'
    comments = get_video_comments(video_id)

    if comments:
        print(comments)
    else:
        print('No comments found.')