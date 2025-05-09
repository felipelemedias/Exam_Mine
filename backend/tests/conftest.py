import os
import sys
import pytest
from fastapi.testclient import TestClient

# Adiciona o diretório raiz (backend/) ao PYTHONPATH para que 'app' seja importável
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.main import app

@pytest.fixture
def client():
    """Fixture que retorna um TestClient configurado para a aplicação FastAPI."""
    # Solução compatível com versões mais novas
    return TestClient(app, raise_server_exceptions=False)