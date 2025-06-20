from flask import Blueprint, request
from services.auth_service import register_user, login_user
from services.lunch_service import fetch_lunch_data

auth_bp = Blueprint('auth', __name__)
lunch_bp = Blueprint('lunch', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
  return register_user(request.get_json())

@auth_bp.route('/login', methods=['POST'])
def login():
  return login_user(request.get_json())

@lunch_bp.route('/lunch', methods=['GET'])
def lunch():
  return fetch_lunch_data()