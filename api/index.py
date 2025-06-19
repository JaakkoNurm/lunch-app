from flask import Flask, request, jsonify
from flask_jwt_extended import (
  JWTManager, create_access_token,
  jwt_required, get_jwt_identity
)
import requests
import bcrypt
import psycopg
from psycopg import OperationalError
from psycopg.rows import dict_row
from datetime import datetime, timezone, timedelta
import urllib.parse
from bs4 import BeautifulSoup


app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "b394c5abe1ec5fb08111c1ee"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


def scrape_lunch_data(restaurant, url, selector):
  response = requests.get(url)
  soup = BeautifulSoup(response.text, 'html.parser')
  print("soup", soup)

  lunch_items = soup.find_all('span', class_=selector)
  lunch_data = [item.text.strip() for item in lunch_items]

  return {
    "restaurant": restaurant,
    "menu": lunch_data
  }

def parse_restaurant_data(data):
  parsed_data = []

  for entry in data:
    location_name = entry.get("locationName")
    restaurant_info = entry.get("restaurant", {})
    day_menu = entry.get("dayMenu", {})

    # Basic restaurant fields
    restaurant = {
      "locationName": location_name,
      "restaurantName": restaurant_info.get("name"),
      "openingHoursToday": restaurant_info.get("openingHoursToday"),
      "image": restaurant_info.get("image"),
      "url": restaurant_info.get("url"),
      "menu": []
    }

    # Collect meals from all menu packages
    menu_packages = day_menu.get("menuPackages", [])
    for package in menu_packages:
      meals = package.get("meals", [])
      for meal in meals:
        meal_entry = {
          "mealName": meal.get("name").strip(),
          "mealPrice": package.get("price"),
          "diets": meal.get("diets", [])
        }
        restaurant["menu"].append(meal_entry)

    parsed_data.append(restaurant)

  return parsed_data

@app.route('/api/lunch', methods=['GET'])
def get_lunch():
  today = datetime.now(timezone.utc).isoformat()
  language = 'en'

  res = requests.get(
    f'https://www.unica.fi/menuapi//menu-block-summaries?blockId=10227&date={urllib.parse.quote(today)}&language={language}'
  )
  data = res.json()
  restaurants = parse_restaurant_data(data)

  return jsonify(restaurants)

PG_HOST = "localhost"
PG_DATABASE = "postgres"
PG_USER = "postgres"
PG_PASSWORD = "postgres"
PG_PORT = 5432

def create_connection(rowFactory=None):
    connection = None
    try:
        connection = psycopg.connect(
            dbname=PG_DATABASE,
            user=PG_USER,
            password=PG_PASSWORD,
            host=PG_HOST,
            port=PG_PORT,
            row_factory=rowFactory
        )
    except OperationalError as e:
        print(f"The error '{e}' occurred")
    return connection

@app.route('/api/user/register', methods=['POST'])
def registerUser():
  userData = request.get_json()
  username = userData.get('username')
  email = userData.get('email')
  firstname = userData.get('firstName')
  lastname = userData.get('lastName')
  profilePicture = userData.get('profilePicture')

  readablePwd = bytes(userData.get('password'), "utf-8")
  salt = bcrypt.gensalt()
  hashedPwd = bcrypt.hashpw(readablePwd, salt).decode('utf-8')

  query = """
    INSERT INTO public.users(email, username, firstname, lastname, "profilePicture", password)
	    VALUES (%s, %s, %s, %s, %s, %s);
  """

  connection = create_connection()
  cursor = connection.cursor()
  if not connection:
    return jsonify({"error": "Database connection failed"}), 500

  try:
    cursor.execute(query, (email, username, firstname, lastname, profilePicture, hashedPwd))
    connection.commit()
    token = create_access_token(identity=username)
    return jsonify({
      "message": "User registered successfully",
      "success": True,
      "access_token": token
    }), 200
  except Exception as e:
    print(f"Error registering user: {e}")
    return jsonify({"error": "Failed to register user", "details": str(e)}), 500
  finally:
    cursor.close()
    connection.close()


if __name__ == '__main__':
  app.run(port=5328)
