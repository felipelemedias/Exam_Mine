# === stage 1: builder ===
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# === stage 2: runtime ===
FROM python:3.11-slim
WORKDIR /app

# 1) cópia das dependências
COPY --from=builder /usr/local/lib/python3.11/site-packages \
                     /usr/local/lib/python3.11/site-packages

# 2) cópia dos scripts de entrada (uvicorn, etc)
COPY --from=builder /usr/local/bin /usr/local/bin

# 3) seu código
COPY app ./app
COPY server.js .
COPY .env .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
