import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API configurations
API_CONFIG = {
    "gemini_api_key": os.getenv("GEMINI_API_KEY"),
}

# Validate required configurations
if not API_CONFIG["gemini_api_key"]:
    raise ValueError("GEMINI_API_KEY is required in the .env file")