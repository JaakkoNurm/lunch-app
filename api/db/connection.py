import psycopg
from psycopg import OperationalError
from config import Config

def create_connection(rowFactory=None):
  connection = None
  try:
    connection = psycopg.connect(
      dbname=Config.PG_DATABASE,
      user=Config.PG_USER,
      password=Config.PG_PASSWORD,
      host="localhost",
      port=Config.PG_PORT,
      row_factory=rowFactory
    )
  except OperationalError as e:
      print(f"The error '{e}' occurred")
  return connection