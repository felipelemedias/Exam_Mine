import fitz  # PyMuPDF
import logging

logger = logging.getLogger("exam-analyzer-api")

def extract_pdf_content(file_path):
    """
    Extract text content from a PDF file
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text content
    """
    logger.info(f"Opening PDF file: {file_path}")
    try:
        # Open the PDF file
        doc = fitz.open(file_path)
        logger.info(f"PDF opened successfully: {doc.page_count} pages")
        
        # Extract text from each page
        text_content = ""
        for i, page in enumerate(doc):
            logger.info(f"Processing page {i+1}/{doc.page_count}")
            text = page.get_text()
            text_content += text
            logger.info(f"Page {i+1} processed: {len(text)} characters extracted")
        
        logger.info(f"PDF content extraction complete: {len(text_content)} characters total")
        return text_content
        
    except Exception as e:
        logger.error(f"Error extracting PDF content: {str(e)}")
        raise Exception(f"Failed to extract PDF content: {str(e)}")