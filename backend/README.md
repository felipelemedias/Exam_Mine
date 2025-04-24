# Exam Mine Backend

This is the FastAPI backend for the Exam Mine application, which provides exam analysis and medication information services.

## Setup

### Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pgAdmin 4 (for database management)

### Database Setup

1. Make sure PostgreSQL is running
2. Create a database called `exam_mine` or update the `.env` file with your database name
3. Run the database initialization script:

```bash
cd backend
python -m app.scripts.init_db
```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exam_mine
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Settings
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication

The API uses JWT for authentication. To access protected endpoints:

1. Register a user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Use the returned token in the Authorization header: `Bearer <token>`

Protected endpoints will return 401 Unauthorized if the token is missing or invalid.