from flask import Flask, jsonify
from datetime import datetime, timezone
import requests
import urllib.parse
from bs4 import BeautifulSoup

app = Flask(__name__)

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

if __name__ == '__main__':
  app.run(port=5328)
