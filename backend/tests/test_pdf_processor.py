import pytest
from app.pdf_processor import extract_pdf_content

def test_extract_pdf_content_file_not_found():
    # Como o FileNotFoundError é capturado e relançado como Exception,
    # esperamos uma Exception genérica com a mensagem adequada
    with pytest.raises(Exception) as exc:
        extract_pdf_content("no-such-file.pdf")
    assert "Failed to extract PDF content" in str(exc.value)
