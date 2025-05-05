from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
import logging
from uuid import uuid4
import os
from typing import Optional

from app.firebase_admin import verify_firebase_token
from app.pdf_processor import extract_pdf_content
from app.gemini_client import (
    analyze_exam,
    analyze_and_answer,
    search_medication_info,
    search_medication_prices,
    answer_general_question
)

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("exam-analyzer-api")

app = FastAPI(title="Exam Mine API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user_from_token(authorization: str = Header(None)) -> Optional[dict]:
    """
    Extrai e verifica o token Firebase do header Authorization.
    Retorna None se inválido ou ausente.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.replace("Bearer ", "")
    return verify_firebase_token(token)

@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "Welcome to Exam Mine API"}

@app.post("/agents/analyze-exam")
async def analyze_exam_endpoint(
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_current_user_from_token)
):
    """
    Processa upload de PDF de exame. Requer autenticação.
    """
    try:
        logger.info(f"Processing exam upload for file: {file.filename}")

        # Autenticação
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required for exam analysis"
            )

        # Validação de tamanho (5MB)
        contents = await file.read()
        await file.seek(0)
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File too large. Maximum size is 5MB."
            )

        # Validação de extensão
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Only PDF files are supported."
            )

        # Salva temporariamente
        temp_file_path = f"temp_{uuid4()}.pdf"
        with open(temp_file_path, "wb") as buf:
            buf.write(contents)

        try:
            exam_content = extract_pdf_content(temp_file_path)
            if not exam_content or len(exam_content) < 10:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Could not extract text from the PDF."
                )
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

        # Análise pelo Gemini
        session_id = str(uuid4())
        analysis_result = analyze_exam(exam_content, session_id)

        return {
            "session_id": session_id,
            "analysis": analysis_result
        }

    except HTTPException:
        # Repassa 401, 413, 415, 422
        raise
    except Exception as e:
        logger.error(f"Error analyzing exam: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing exam: {e}"
        )

@app.post("/agents/exam-question")
async def exam_question_endpoint(
    question: str = Form(...),
    session_id: str = Form(...),
    current_user: Optional[dict] = Depends(get_current_user_from_token)
):
    """
    Perguntas de seguimento sobre exame. Requer autenticação.
    """
    try:
        logger.info(f"Processing exam question: {question}, session_id: {session_id}")

        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required for exam questions"
            )

        answer = analyze_and_answer(question, session_id)
        return {"answer": answer}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing exam question: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing exam question: {e}"
        )

@app.post("/agents/medication-info")
async def medication_info_endpoint(medication_name: str = Form(...)):
    """
    Busca informações de medicação.
    """
    try:
        logger.info(f"Looking up info for medication: {medication_name}")
        info = search_medication_info(medication_name)
        return {"information": info}
    except Exception as e:
        logger.error(f"Error getting medication info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting medication info: {e}"
        )

@app.post("/agents/medication-prices")
async def medication_prices_endpoint(medication_name: str = Form(...)):
    """
    Compara preços de medicação.
    """
    try:
        logger.info(f"Looking up prices for medication: {medication_name}")
        prices = search_medication_prices(medication_name)
        return {"prices": prices}
    except Exception as e:
        logger.error(f"Error getting medication prices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting medication prices: {e}"
        )

@app.post("/agents/general-question")
async def general_question_endpoint(
    question: str = Form(...),
    current_user: Optional[dict] = Depends(get_current_user_from_token)
):
    """
    Responde perguntas gerais de saúde.
    """
    try:
        logger.info(f"Answering general health question: {question}")
        answer = answer_general_question(question)
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error answering general question: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error answering general question: {e}"
        )
