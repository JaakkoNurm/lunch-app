from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import register_user, login_user
from services.lunch_service import fetch_lunch_data, insert_comment, get_comments

auth_bp = Blueprint('auth', __name__)
lunch_bp = Blueprint('lunch', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
  return register_user(request.get_json())

@auth_bp.route('/login', methods=['POST'])
def login():
  return login_user(request.get_json())

@auth_bp.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
  user_identity = get_jwt_identity()
  return jsonify({
    'valid': True,
    'user': user_identity
  }), 200

@lunch_bp.route('/lunch', methods=['GET'])
def lunch():
  return fetch_lunch_data()

@lunch_bp.route('/lunch/post-comment', methods=['POST'])
def post_comment():
  return insert_comment(request.get_json())

@lunch_bp.route('/lunch/get-comments', methods=['GET'])
def comments():
  restaurant_id = request.args.get('restaurantId', type=int)
  return get_comments(restaurant_id)