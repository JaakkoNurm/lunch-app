import os
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv

# Check if we're in development mode
ENVIRONMENT = os.getenv("FLASK_ENV", "development")
print("Flask server running in", ENVIRONMENT)

if ENVIRONMENT == "development":
    # Load .env only in development
    load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')

class Config:
    if ENVIRONMENT == "development":
        PG_HOST = "localhost"
    else:
        PG_HOST = os.getenv("PG_HOST", "localhost")
    PG_DATABASE = os.getenv("PG_DATABASE", "postgres")
    PG_USER = os.getenv("PG_USER", "postgres")
    PG_PASSWORD = os.getenv("PG_PASSWORD", "")
    PG_PORT = int(os.getenv("PG_PORT", 5432))

    JWT_SECRET = os.getenv("JWT_SECRET", "super-secret")
    JWT_TOKEN_EXPIRES = timedelta(hours=int(os.getenv("JWT_EXPIRE_HOURS", 1)))
