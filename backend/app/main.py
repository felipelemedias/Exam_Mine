from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends, Cookie, Response, Header, status
from fastapi.middleware.cors import CORSMiddleware
import logging
from uuid import uuid4
import os
from typing import Optional
import json

# Import Firebase admin for authentication
from .firebase_admin import verify_firebase_token

# Import existing modules
from .database import get_db, init_db
from .models import User
from .gemini_client import analyze_exam, analyze_and_answer, search_medication_info, search_medication_prices, answer_general_question
from .pdf_processor import extract_pdf_content

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("exam-analyzer-api")

# Create FastAPI app
app = FastAPI(title="Exam Mine API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase token verification dependency
async def get_current_user_from_token(authorization: str = Header(None)) -> Optional[dict]:
    """Extract and verify the Firebase token from the Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        return None
        
    token = authorization.replace("Bearer ", "")
    return verify_firebase_token(token)

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "Welcome to Exam Mine API"}

# API endpoint for exam analysis
@app.post("/agents/analyze-exam")
async def analyze_exam_endpoint(
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_current_user_from_token)
):
    """
    Process and analyze uploaded exam PDF
    """
    try:
        logger.info(f"Processing exam upload for file: {file.filename}")
        
        # Ensure user is authenticated for premium feature
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required for exam analysis"
            )
        
        # Validate file size (5MB limit)
        file_size = 0
        contents = await file.read()
        file_size = len(contents)
        await file.seek(0)
        
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File too large. Maximum size is 5MB."
            )
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Only PDF files are supported."
            )
        
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{uuid4()}.pdf"
        with open(temp_file_path, "wb") as buffer:
            buffer.write(contents)
        
        # Extract text content
        try:
            exam_content = extract_pdf_content(temp_file_path)
            if not exam_content or len(exam_content) < 10:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Could not extract text from the PDF. The file may be corrupted, password protected, or contain no text."
                )
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        
        # Generate a unique session ID for follow-up questions
        session_id = str(uuid4())
        
        # Analyze exam content
        analysis_result = analyze_exam(exam_content, session_id)
        
        # Save interaction to Firestore
        # This would be implemented if we were using Firebase Firestore directly
        
        return {
            "session_id": session_id,
            "analysis": analysis_result
        }
        
    except Exception as e:
        logger.error(f"Error analyzing exam: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing exam: {str(e)}"
        )

# API endpoint for follow-up questions about exams
@app.post("/agents/exam-question")
async def exam_question_endpoint(
    question: str = Form(...),
    session_id: str = Form(...),
    current_user: Optional[dict] = Depends(get_current_user_from_token)
):
    """
    Process follow-up questions about a previously analyzed exam
    """
    try:
        logger.info(f"Processing exam question: {question}, session_id: {session_id}")
        
        # Ensure user is authenticated for premium feature
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required for exam questions"
            )
            
        # Send the question and get a response
        answer = analyze_and_answer(question, session_id)
        
        return {
            "answer": answer
        }
        
    except Exception as e:
        logger.error(f"Error processing exam question: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing exam question: {str(e)}"
        )

# API endpoint for medication information lookup
@app.post("/agents/medication-info")
async def medication_info_endpoint(
    medication_name: str = Form(...)
):
    """
    Look up information about a medication
    """
    try:
        logger.info(f"Looking up info for medication: {medication_name}")
        
        # Call the medication info function
        medication_info = search_medication_info(medication_name)
        
        return {
            "information": medication_info
        }
        
    except Exception as e:
        logger.error(f"Error getting medication info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting medication info: {str(e)}"
        )

# API endpoint for medication price comparison
@app.post("/agents/medication-prices")
async def medication_prices_endpoint(
    medication_name: str = Form(...)
):
    """
    Look up and compare prices for a medication
    """
    try:
        logger.info(f"Looking up prices for medication: {medication_name}")
        
        # Call the medication prices function
        price_comparison = search_medication_prices(medication_name)
        
        return {
            "prices": price_comparison
        }
        
    except Exception as e:
        logger.error(f"Error getting medication prices: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting medication prices: {str(e)}"
        )

# API endpoint for general health questions
@app.post("/agents/general-question")
async def general_question_endpoint(
    question: str = Form(...),
    current_user: Optional[dict] = Depends(get_current_user_from_token)
):
    """
    Answer general health questions
    """
    try:
        logger.info(f"Answering general health question: {question}")
        
        # Call the general question answering function
        answer = answer_general_question(question)
        
        return {
            "answer": answer
        }
        
    except Exception as e:
        logger.error(f"Error answering general question: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error answering general question: {str(e)}"
        )