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

def get_menu_via_api(restaurant, url):
  print(url)
  response = requests.get(url)
  data = response.json()
  meals = []

  for package in data['menuPackages']:
    meals.extend(package['meals'])
  return {
    "restaurant": restaurant,
    "menu": meals
  }



@app.route('/api/lunch', methods=['GET'])
def get_lunch():
  costCenter = 1920
  today = datetime.now(timezone.utc).isoformat()
  language = 'en'

  menus = [
    get_menu_via_api("Assarin Ullakko", f'https://www.unica.fi/menuapi/day-menus?costCenter={costCenter}&date={urllib.parse.quote(today)}&language={language}'),
  ]

  return jsonify(menus)

if __name__ == '__main__':
  app.run(port=5328)
