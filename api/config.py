import os
from datetime import timedelta

class Config:
    PG_HOST = os.getenv("PG_HOST", "localhost")
    PG_DATABASE = os.getenv("PG_DATABASE", "postgres")
    PG_USER = os.getenv("PG_USER", "postgres")
    PG_PASSWORD = os.getenv("PG_PASSWORD", "")
    PG_PORT = int(os.getenv("PG_PORT", 5432))

    JWT_SECRET = os.getenv("JWT_SECRET", "super-secret")
    JWT_TOKEN_EXPIRES = timedelta(hours=int(os.getenv("JWT_EXPIRE_HOURS", 1)))
