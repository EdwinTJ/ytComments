# src/config.py
import os
from dotenv import load_dotenv
from pathlib import Path

def load_environment():
    """
    Load environment variables based on the ENVIRONMENT setting.
    Defaults to development environment if not specified.
    """
    env = os.getenv('ENVIRONMENT', 'development')
    
    # Get the root directory of the project
    root_dir = Path(__file__).parent.parent
    
    if env == 'development':
        env_file = root_dir / '.env.dev'
    else:
        env_file = root_dir / '.env'
    
    # Load the appropriate environment file if it exists
    if env_file.exists():
        load_dotenv(env_file)
    else:
        load_dotenv()  # Fallback to default .env
        
    return env

# Load environment variables
ENVIRONMENT = load_environment()

# Configuration variables
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
YOUTUBE_API_SERVICE_NAME = os.getenv('YOUTUBE_API_SERVICE_NAME')
YOUTUBE_API_VERSION = os.getenv('YOUTUBE_API_VERSION')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = 2880

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')
SESSION_SECRET_KEY = os.getenv('SESSION_SECRET_KEY')

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')

# Validate required environment variables
required_vars = [
    'YOUTUBE_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI',
    'SESSION_SECRET_KEY',
    'OPENAI_API_KEY'
]

missing_vars = [var for var in required_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")