from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv()

key = os.environ.get("KEY")

db = SQLAlchemy()
DB_NAME = "database.db"

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = key
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    db.init_app(app)
    migrate = Migrate(app, db)

    from .views import views
    from .auth import auth

    #the prefix of the url
    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")

    from .models import User, Task, Account_counter

    create_database(app)

    login_manager = LoginManager()
    login_manager.login_view = "auth.login" #if user is not login, redirect to login page
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id)) #find the id with its information that is similar to the input id

    return app

def create_database(app):
    with app.app_context():
        db.create_all()
        print("Created database")