from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from src.config import ( YOUTUBE_API_KEY, YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION)

def get_channel_videos(channel_id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_API_KEY)
    try:
        # Fetch the videos from the channel
        response = youtube.search().list(
            channelId=channel_id,
            type='video',
            part='id,snippet',
            maxResults=50,
            order='date'
        ).execute()
        # Parse the response and return videos
        videos = []
        for item in response.get('items', []):
            video_data = {
                'title': item['snippet']['title'],
                'videoId': item['id']['videoId'],
                'thumbnail': item['snippet']['thumbnails']['high']['url'],
                'description': item['snippet']['description']
            }
            videos.append(video_data)
        return videos
    except HttpError as e:
        print(f"An HTTP error {e.resp.status} occurred: {e.content}")
        return []
    except KeyError as e:
        print(f"KeyError occurred: {str(e)}")
        return []
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return []

def get_video_comments(video_id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_API_KEY)

    try:
        # Get the comments
        response = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100
        ).execute()

        # Extract the comments and store them in a list
        comments = []
        for item in response['items']:
            comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
            comments.append(comment)

        return comments
    except HttpError as e:
        print(f"An HTTP error {e.resp.status} occurred: {e.content}")
        return []
    except KeyError as e:
        print(f"KeyError occurred: {str(e)}")
        return []
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return []