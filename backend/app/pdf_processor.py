import fitz  # PyMuPDF
import logging
import os

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
        # Make sure the file exists
        if not os.path.isfile(file_path):
            logger.error(f"PDF file not found: {file_path}")
            raise FileNotFoundError(f"PDF file not found: {file_path}")
            
        # Open the PDF file with error handling
        try:
            doc = fitz.open(file_path)
            logger.info(f"PDF opened successfully: {doc.page_count} pages")
        except Exception as e:
            logger.error(f"Error opening PDF: {str(e)}")
            raise Exception(f"Could not open PDF file: {str(e)}")
        
        # Extract text from each page with explicit UTF-8 handling
        text_content = ""
        for i, page in enumerate(doc):
            logger.info(f"Processing page {i+1}/{doc.page_count}")
            try:
                # Get text with explicit UTF-8 handling
                text = page.get_text()
                # Ensure text is valid UTF-8
                if not isinstance(text, str):
                    text = text.decode('utf-8', errors='replace')
                text_content += text
                logger.info(f"Page {i+1} processed: {len(text)} characters extracted")
            except Exception as e:
                logger.error(f"Error extracting text from page {i+1}: {str(e)}")
                # Continue with next page instead of failing completely
                text_content += f"\n[Error extracting text from page {i+1}]\n"
        
        logger.info(f"PDF content extraction complete: {len(text_content)} characters total")
        return text_content
        
    except Exception as e:
        logger.error(f"Error extracting PDF content: {str(e)}")
        raise Exception(f"Failed to extract PDF content: {str(e)}")