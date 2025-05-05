import pytest
from unittest.mock import patch
import app.firebase_admin as fb_admin
from app.firebase_admin import verify_firebase_token

@patch("firebase_admin.auth.verify_id_token")
def test_verify_token_success(mock_verify):
    # Simula SDK inicializado
    fb_admin.firebase_initialized = True
    mock_verify.return_value = {"uid": "123", "email": "t@t.com"}

    out = verify_firebase_token("valid-token")
    assert out["uid"] == "123"

@patch("firebase_admin.auth.verify_id_token", side_effect=Exception("err"))
def test_verify_token_invalid(mock_verify):
    fb_admin.firebase_initialized = True
    out = verify_firebase_token("invalid-token")
    assert out is None

def test_verify_token_skipped_when_not_initialized(monkeypatch):
    monkeypatch.setattr(fb_admin, "firebase_initialized", False)
    out = verify_firebase_token("any")
    assert out == {"uid": "test-uid", "email": "test@example.com"}
