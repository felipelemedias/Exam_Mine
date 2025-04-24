from fastapi import Depends, HTTPException, status, Cookie, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import logging

from .database import get_db
from .models import User
from .security import verify_password, get_password_hash, create_access_token, decode_token, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY

# Set up logging
logger = logging.getLogger("exam-analyzer-api")

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# OAuth2 scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Helper functions
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()

def create_new_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user."""
    try:
        # Check if user exists
        existing_user = get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            is_active=True
        )
        
        # Save to database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        db.rollback()
        raise

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Validate user credentials and return user if valid."""
    try:
        user = get_user_by_email(db, email)
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
        
    except Exception as e:
        logger.error(f"Error during authentication: {str(e)}")
        return None

# JWT token extraction
def get_token_from_cookie(authorization: Optional[str] = Cookie(None, alias="session")) -> Optional[str]:
    """Get token from cookie."""
    return authorization

def get_token_from_header(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Get token from Authorization header."""
    if authorization and authorization.startswith("Bearer "):
        return authorization.replace("Bearer ", "")
    return None

async def get_current_user(
    db: Session = Depends(get_db),
    token_cookie: Optional[str] = Depends(get_token_from_cookie),
    token_header: Optional[str] = Depends(get_token_from_header)
) -> Optional[User]:
    """Get current user from JWT token."""
    token = token_cookie or token_header
    if not token:
        return None
    
    try:
        payload = decode_token(token)
        if payload is None:
            return None
        
        email = payload.get("sub")
        if email is None:
            return None
            
        user = get_user_by_email(db, email)
        if user is None:
            return None
            
        return user
    except JWTError as e:
        logger.error(f"JWT error: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in get_current_user: {str(e)}")
        return None

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get current active user."""
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return current_user