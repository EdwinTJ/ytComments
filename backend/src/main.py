from googleapiclient.discovery import build
from dotenv import load_dotenv
from openai import OpenAI
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

if __name__ == '__main__':
    # Get the video ID and prompt from the user
    print("Welcome to the YouTube Comment Summarizer!")
    print("Option 1: Summarize comments from a video")
    print("Option 2: Get videos from a channel")
    option = input("Enter the option: ")
    if option == '1':
        video_id = input("Enter the video ID: ")
        prompt = input("Enter the prompt: ")
        comments = get_video_comments(video_id)

        if comments:
            summary = summarize_comments(comments, prompt)
            print("Summary of Comments:")
            print(summary)
        else:
            print('No comments found.')
    else:
        channel_id = input("Enter the channel ID: ")
        videos = get_channel_videos(channel_id)
        for video in videos:
            print(f"Title: {video['title']}")
            print(f"Video ID: {video['videoId']}")
            print(f"Thumbnail: {video['thumbnail']}")
            print(f"Description: {video['description']}")
            print()
   