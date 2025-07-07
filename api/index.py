import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes import auth_bp, lunch_bp

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:3000",  # Local development
    "https://lunch-app-frontend.fly.dev",  # Production frontend URL
    "https://*.fly.dev"  # Allow all fly.dev subdomains
])

app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = Config.JWT_TOKEN_EXPIRES
jwt = JWTManager(app)

app.register_blueprint(lunch_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/user')

if __name__ == '__main__':
  port = os.environ.get('PORT', 5328)
  app.run(host='0.0.0.0', port=port)
