"""
Script to create the PostgreSQL database for the application
Run this script before starting the application if the database doesn't exist
"""
import psycopg2
import os
import sys
import logging
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("init-db-script")

# Load environment variables
load_dotenv()

# Database connection settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "exam_mine")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")

def create_database():
    """Create the PostgreSQL database if it doesn't exist"""
    try:
        logger.info(f"Connecting to PostgreSQL server at {DB_HOST}:{DB_PORT}")
        # Connect to PostgreSQL server with explicit UTF-8 encoding
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            # Connect to 'postgres' database to create our application database
            dbname="postgres",
            # Set client encoding and string handling
            options="-c client_encoding=utf8"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        logger.info(f"Checking if database '{DB_NAME}' exists")
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
        exists = cursor.fetchone()
        
        if not exists:
            # Create the database with UTF-8 encoding
            logger.info(f"Database '{DB_NAME}' does not exist, creating with UTF-8 encoding...")
            cursor.execute(f"""
                CREATE DATABASE {DB_NAME} 
                ENCODING 'UTF8' 
                LC_COLLATE 'C.UTF-8' 
                LC_CTYPE 'C.UTF-8' 
                TEMPLATE template0;
            """)
            logger.info(f"Database '{DB_NAME}' created successfully!")
        else:
            logger.info(f"Database '{DB_NAME}' already exists.")
            
            # Check and potentially update encoding for existing database
            cursor.execute(f"SELECT pg_encoding_to_char(encoding) FROM pg_database WHERE datname = '{DB_NAME}'")
            current_encoding = cursor.fetchone()[0]
            logger.info(f"Current database encoding is: {current_encoding}")
            
            if current_encoding.lower() != 'utf8':
                logger.warning(f"Database encoding is not UTF-8. Consider recreating the database with correct encoding.")
        
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        logger.error(f"Error creating database: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting database creation script...")
    success = create_database()
    if success:
        logger.info("Database setup completed successfully!")
    else:
        logger.error("Database setup failed!")
        sys.exit(1)