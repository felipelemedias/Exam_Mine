"""
Firebase Admin SDK integration for backend authentication verification
"""

import os
import json
import logging
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth

# Set up logging
logger = logging.getLogger("exam-analyzer-api")

# Initialize Firebase Admin SDK
firebase_initialized = False
try:
    # Check if Firebase credentials are available
    cred_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if cred_json:
        cred_dict = json.loads(cred_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # Fallback to a local service account file for development
        cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            # Create minimal cert for initialization
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": "exam-mine"
            })
            logger.warning("Using minimal Firebase credentials. Token verification will be skipped.")

    firebase_admin.initialize_app(cred)
    firebase_initialized = True
    logger.info("Firebase Admin SDK initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
    firebase_initialized = False

def verify_firebase_token(token: str) -> Optional[dict]:
    """
    Verify Firebase ID token and return decoded token if valid
    
    Args:
        token: Firebase ID token to verify
        
    Returns:
        dict: Decoded token payload or None if invalid
    """
    if not firebase_initialized:
        logger.warning("Firebase not initialized, skipping token verification")
        return {"uid": "test-uid", "email": "test@example.com"}
        
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.InvalidIdTokenError:
        logger.error("Invalid Firebase ID token")
        return None
    except Exception as e:
        logger.error(f"Failed to verify Firebase token: {str(e)}")
        return None