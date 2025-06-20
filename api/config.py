from datetime import timedelta

class Config:
  PG_HOST = "localhost"
  PG_DATABASE = "postgres"
  PG_USER = "postgres"
  PG_PASSWORD = "postgres"
  PG_PORT = 5432
  JWT_SECRET = "b394c5abe1ec5fb08111c1ee"
  JWT_TOKEN_EXPIRES = timedelta(hours=1)