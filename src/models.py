from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

#table of accounts information
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True) #each user has a unique id
    username = db.Column(db.String(20)) #max length of username is 20
    email = db.Column(db.String(150), unique=True) #max length of email is 150
    password = db.Column(db.String(150)) #max length of password is 150
    date_create = db.Column(db.DateTime(timezone=True), default=func.now()) #record the date the account was created