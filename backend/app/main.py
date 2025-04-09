from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging
from .pdf_processor import extract_pdf_content
from .gemini_client import analyze_exam, search_medication_info, search_medication_prices, answer_general_question, get_available_models
import os
from typing import Optional
from pydantic import BaseModel

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
    allow_origins=["http://localhost:5173"],  # Restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Maximum file size (5MB = 5 * 1024 * 1024 bytes)
MAX_FILE_SIZE = 5 * 1024 * 1024

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "Welcome to Exam Mine API"}

@app.get("/api/models")
async def list_models():
    """Get a list of available Gemini models"""
    logger.info("List models endpoint called")
    models = get_available_models()
    return {"models": models}

def validate_file_size(file: UploadFile):
    """Validate if file is within size limits"""
    # Get file size
    file.file.seek(0, 2)  # Move to end of file
    file_size = file.file.tell()  # Get current position (size)
    file.file.seek(0)  # Reset file position
    
    logger.info(f"File size: {file_size} bytes (limit: {MAX_FILE_SIZE} bytes)")
    
    if file_size > MAX_FILE_SIZE:
        logger.error(f"File too large: {file_size} bytes (max: {MAX_FILE_SIZE} bytes)")
        raise HTTPException(status_code=413, detail=f"File too large. Maximum allowed size is 5MB.")
    
    return file

@app.post("/api/agents/analyze-exam")
async def analyze_exam_endpoint(file: UploadFile = Depends(validate_file_size)):
    """
    Agent 1: Endpoint to upload a PDF exam and get AI analysis
    """
    logger.info(f"File upload initiated: {file.filename}")
    
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        logger.error(f"Invalid file format: {file.filename}")
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    try:
        # Save file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        logger.info(f"File upload completed: {file.filename}")
        
        # Extract content from PDF
        logger.info(f"Starting PDF content extraction: {file.filename}")
        pdf_content = extract_pdf_content(temp_file_path)
        logger.info(f"PDF content extraction completed: {len(pdf_content)} characters extracted")
        
        # Send to Gemini for analysis
        logger.info("Sending content to Gemini API for analysis")
        analysis_result = analyze_exam(pdf_content)
        logger.info("Gemini API analysis completed")
        
        # Clean up temporary file
        os.remove(temp_file_path)
        logger.info(f"Temporary file removed: {temp_file_path}")
        
        return {
            "status": "success",
            "filename": file.filename,
            "analysis": analysis_result
        }
        
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        
        # Delete temporary file if it exists
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            logger.info(f"Temporary file removed after error: {temp_file_path}")
        
        # Provide more user-friendly error message
        error_message = str(e)
        if "GEMINI_API_KEY" in error_message:
            error_message = "API key for Gemini not configured correctly. Please check the server configuration."
        elif "model" in error_message.lower() and "not found" in error_message.lower():
            error_message = "The AI model is not available. Please check the server logs for details."
        
        raise HTTPException(status_code=500, detail=error_message)

@app.post("/api/agents/medication-info")
async def medication_info_endpoint(medication_name: str = Form(...)):
    """
    Agent 2: Endpoint to look up medication information
    """
    logger.info(f"Medication info request for: {medication_name}")
    
    try:
        # Get medication information from Gemini
        logger.info(f"Sending medication info request to Gemini API: {medication_name}")
        info_result = search_medication_info(medication_name)
        logger.info("Gemini API medication info response received")
        
        return {
            "status": "success",
            "medication": medication_name,
            "information": info_result
        }
        
    except Exception as e:
        logger.error(f"Error getting medication info: {str(e)}")
        
        # Provide more user-friendly error message
        error_message = str(e)
        if "GEMINI_API_KEY" in error_message:
            error_message = "API key for Gemini not configured correctly. Please check the server configuration."
        elif "model" in error_message.lower() and "not found" in error_message.lower():
            error_message = "The AI model is not available. Please check the server logs for details."
        
        raise HTTPException(status_code=500, detail=error_message)

@app.post("/api/agents/medication-prices")
async def medication_prices_endpoint(medication_name: str = Form(...)):
    """
    Agent 3: Endpoint to search for medication prices
    """
    logger.info(f"Medication price request for: {medication_name}")
    
    try:
        # Get medication prices from Gemini
        logger.info(f"Sending medication price request to Gemini API: {medication_name}")
        price_result = search_medication_prices(medication_name)
        logger.info("Gemini API medication price response received")
        
        return {
            "status": "success",
            "medication": medication_name,
            "prices": price_result
        }
        
    except Exception as e:
        logger.error(f"Error getting medication prices: {str(e)}")
        
        # Provide more user-friendly error message
        error_message = str(e)
        if "GEMINI_API_KEY" in error_message:
            error_message = "API key for Gemini not configured correctly. Please check the server configuration."
        elif "model" in error_message.lower() and "not found" in error_message.lower():
            error_message = "The AI model is not available. Please check the server logs for details."
        
        raise HTTPException(status_code=500, detail=error_message)

@app.post("/api/agents/general-question")
async def general_question_endpoint(request: QuestionRequest):
    """
    Agent 4: Endpoint to answer general health questions
    """
    question = request.question
    logger.info(f"General question received: {question}")
    
    try:
        # Get answer from Gemini
        logger.info(f"Sending question to Gemini API: {question}")
        answer = answer_general_question(question)
        logger.info("Gemini API answer received")
        
        return {
            "status": "success",
            "question": question,
            "answer": answer
        }
        
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        
        # Provide more user-friendly error message
        error_message = str(e)
        if "GEMINI_API_KEY" in error_message:
            error_message = "API key for Gemini not configured correctly. Please check the server configuration."
        elif "model" in error_message.lower() and "not found" in error_message.lower():
            error_message = "The AI model is not available. Please check the server logs for details."
        
        raise HTTPException(status_code=500, detail=error_message)