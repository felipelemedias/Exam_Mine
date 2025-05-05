import pytest

def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json() == {"message": "Welcome to Exam Mine API"}

def test_analyze_exam_requires_auth(client, tmp_path):
    # Cria um PDF mínimo no diretório temporário
    pdf_file = tmp_path / "sample.pdf"
    pdf_file.write_bytes(b"%PDF-1.4\n%EOF")

    with open(pdf_file, "rb") as f:
        r = client.post(
            "/agents/analyze-exam",
            files={"file": ("sample.pdf", f, "application/pdf")}
        )
    assert r.status_code == 401
