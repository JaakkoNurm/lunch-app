from flask import Flask
from flask_jwt_extended import JWTManager
from config import Config
from routes import auth_bp, lunch_bp

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = Config.JWT_TOKEN_EXPIRES
jwt = JWTManager(app)

app.register_blueprint(lunch_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/user')

if __name__ == '__main__':
  app.run(port=5328)
