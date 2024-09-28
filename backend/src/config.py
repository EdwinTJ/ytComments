import os
from dotenv import load_dotenv
load_dotenv()

# Environment variables
YOUTUBE_API_KEY = os.environ['YOUTUBE_API_KEY']
YOUTUBE_API_SERVICE_NAME = os.environ['YOUTUBE_API_SERVICE_NAME']
YOUTUBE_API_VERSION = os.environ['YOUTUBE_API_VERSION']
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']
SECRET_KEY = os.environ['SECRET_KEY']
ALGORITHM = os.environ['ALGORITHM']


ACCESS_TOKEN_EXPIRE_MINUTES = 2880
