import os
import json
import logging
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

# Set up logging
logger = logging.getLogger("exam-analyzer-api")

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Approach 1: Use JSON file (for GitHub Actions/local)
        if os.path.exists("firebase_credentials.json"):
            cred = credentials.Certificate("firebase_credentials.json")
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized from JSON file")
            return True
        
        # Approach 2: Use environment variables (for Docker/Heroku etc)
        firebase_config = os.getenv("FIREBASE_SERVICE_ACCOUNT")
        if firebase_config:
            cred_dict = json.loads(firebase_config)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized from env variables")
            return True
        
        logger.warning("Firebase not properly configured - running in test mode")
        return False
    
    except Exception as e:
        logger.error(f"Firebase initialization failed: {str(e)}")
        return False

# Initialize Firebase when module loads
firebase_initialized = initialize_firebase()

def verify_firebase_token(token: str) -> Optional[dict]:
    """Verify Firebase ID token"""
    if not firebase_initialized:
        logger.warning("Firebase not initialized - running in test mode")
        return {"uid": "test-uid", "email": "test@example.com"}
    
    try:
        return auth.verify_id_token(token)
    except auth.InvalidIdTokenError:
        logger.error("Invalid Firebase ID token")
        return None
    except Exception as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None