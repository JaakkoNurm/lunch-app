from db.connection import create_connection
from datetime import datetime, timezone
from psycopg.rows import dict_row
from base64 import b64encode
from flask import jsonify
import urllib.parse
import requests
import json

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


def fetch_lunch_data():
  today = datetime.now(timezone.utc).date()
  connection = create_connection(rowFactory=dict_row)
  if not connection:
    return jsonify({"error": "Database connection failed"}), 500

  try:
    with connection.cursor() as cursor:
      # 1. Check if today's data is already loaded
      cursor.execute(
        "SELECT * FROM public.restaurants WHERE \"loadedAt\"::date = %s;",
        (today,)
      )
      cached_data = cursor.fetchall()

      if cached_data:
        return jsonify([{
          "id": row["id"],
          "locationName": row["locationName"],
          "restaurantName": row["restaurantName"],
          "url": row["url"],
          "menu": row["menu"],
          "image": b64encode(row["image"]).decode("utf-8") if row["image"] else None
        } for row in cached_data])

      # 2. Fetch new data from API
      api_url = f'https://www.unica.fi/menuapi/menu-block-summaries?blockId=10227&date={urllib.parse.quote(today.isoformat())}&language=en'
      response = requests.get(api_url)
      if not response.ok:
        return jsonify({"error": "Failed to fetch lunch data"}), 502

      data = response.json()
      parsed_restaurants = parse_restaurant_data(data)

      with connection.cursor() as cursor:
        for restaurant in parsed_restaurants:
          # Fetch image as bytes
          image_bytes = None
          image_b64 = None
          try:
            img_res = requests.get(f'https://www.unica.fi{restaurant["image"]}?preset=medium')
            if img_res.ok:
              image_bytes = img_res.content
              image_b64 = b64encode(image_bytes).decode("utf-8")
          except Exception as e:
            print(f"Failed to fetch image: {e}")

          # Attach base64 image to the restaurant for the response
          restaurant["image"] = image_b64

          # Insert or update restaurant
          cursor.execute("""
            INSERT INTO public.restaurants ("locationName", "restaurantName", image, url, menu)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT ("locationName", "restaurantName") DO UPDATE SET
              image = EXCLUDED.image,
              url = EXCLUDED.url,
              menu = EXCLUDED.menu,
              "loadedAt" = NOW()
            RETURNING id;
          """, (
            restaurant["locationName"],
            restaurant["restaurantName"],
            image_bytes,
            restaurant["url"],
            json.dumps(restaurant["menu"]),
          ))

          restaurant_id = cursor.fetchone()
          restaurant["id"] = restaurant_id

        connection.commit()

    return jsonify(parsed_restaurants)

  except Exception as e:
    print(f"Error: {e}")
    return jsonify({"error": "Server error", "details": str(e)}), 500
  finally:
    connection.close()

def insert_comment(req):
  comment = req.get('comment')
  rating = req.get('rating')
  restaurantId = req.get('restaurantId')
  userId = req.get('userId')

  query = """
    INSERT INTO public.comments(message, rating, "restaurantId", "sentByUser")
      VALUES (%s, %s, %s, %s)
    RETURNING id, "createdAt"
  """

  connection = create_connection(rowFactory=dict_row)
  if not connection:
    return jsonify({"error": "Database connection failed"}), 500

  with connection.cursor() as cursor:
    try:
      cursor.execute(query, (comment, rating, restaurantId, userId))
      result = cursor.fetchone()
      connection.commit()

      return jsonify({
        "success": True,
        "id": result["id"],
        "date": result["createdAt"]
      }), 200
    except Exception as e:
      print(f"Error: {e}")
      return jsonify({"error": "Server error", "details": str(e)}), 500
    finally:
      connection.close()

def get_comments(restaurantId):
  query = """
    SELECT 
      c.id,
      c.message,
      c.rating,
      c."createdAt",
      u.username,
      u."profilePicture"
    FROM public.comments c
    JOIN public.users u ON c."sentByUser" = u.id
    WHERE c."restaurantId" = %s
  """
  connection = create_connection(rowFactory=dict_row)
  if not connection:
    return jsonify({"error": "Database connection failed"}), 500

  with connection.cursor() as cursor:
    try:
      cursor.execute(query, (restaurantId,))
      rows = cursor.fetchall()

      # Format the data to match the Comment type structure
      comments = [
        {
          "id": row["id"],
          "user": {
            "name": row["username"],
            "avatar": b64encode(row["profilePicture"]).decode("utf-8") if row.get("profilePicture") else None
          },
          "text": row["message"],
          "rating": row["rating"],
          "date": row["createdAt"].isoformat() if hasattr(row["createdAt"], 'isoformat') else row["createdAt"]
        }
        for row in rows
      ]

      return jsonify(comments)
    except Exception as e:
      print(f"Error: {e}")
      return jsonify({"error": "Server error", "details": str(e)}), 500
    finally:
      connection.close()
