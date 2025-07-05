from flask import request, jsonify
from flask_jwt_extended import create_access_token
from psycopg.rows import dict_row
from db.connection import create_connection
from base64 import b64decode, b64encode
import bcrypt

def register_user(userData):
  username = userData.get('username')
  email = userData.get('email')
  firstname = userData.get('firstName')
  lastname = userData.get('lastName')
  base64Data = userData.get('profilePicture')

  binaryPfp = b64decode(base64Data)

  readablePwd = bytes(userData.get('password'), "utf-8")
  salt = bcrypt.gensalt()
  hashedPwd = bcrypt.hashpw(readablePwd, salt).decode('utf-8')

  query = """
    INSERT INTO public.users(email, username, firstname, lastname, "profilePicture", password)
	    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING id;
  """

  connection = create_connection()
  cursor = connection.cursor()
  if not connection:
    return jsonify({"error": "Database connection failed"}), 500

  try:
    cursor.execute(query, (email, username, firstname, lastname, binaryPfp, hashedPwd))
    userId = cursor.fetchone()[0]
    connection.commit()
    token = create_access_token(identity=username)
    return jsonify({
      "message": "User registered successfully",
      "success": True,
      "access_token": token,
      "userId": userId
    }), 200
  except Exception as e:
    print(f"Error registering user: {e}")
    return jsonify({"error": "Failed to register user", "details": str(e)}), 500
  finally:
    cursor.close()
    connection.close()

def login_user(req):
  email = req.get('email')
  password = req.get('password')

  if not email or not password:
    return jsonify({"error": "Email and password are required"}), 400

  query = """
    SELECT * FROM public.users WHERE email = %s;
  """

  connection = create_connection(rowFactory=dict_row)
  if not connection:
    return jsonify({"error": "Database connection failed"}), 500

  cursor = connection.cursor()

  try:
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    if not user:
      return jsonify({"error": "Invalid email or password"}), 401
    
    user_data = {
      "id": user['id'],
      "email": user['email'],
      "firstName": user['firstname'],
      "lastName": user['lastname'],
      "username": user['username'],
      "profilePicture": b64encode(user["profilePicture"]).decode("utf-8") if user.get("profilePicture") else None,
    }
    
    hashed_password = user['password']
    if not bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
      return jsonify({"error": "Invalid email or password"}), 401
    
    token = create_access_token(identity=user_data.get("username"))

    return jsonify({
      "message": "Login successful",
      "success": True,
      "access_token": token,
      "user_data": user_data,
    }), 200
  except Exception as e:
    print(f"Error during login: {e}")
    return jsonify({"error": "Login failed", "details": str(e)}), 500
  finally:
    cursor.close()
    connection.close()
