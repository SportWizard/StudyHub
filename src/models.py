from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

#table of accounts information
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True) #each user has a unique id
    username = db.Column(db.String(20)) #max length of username is 20
    password = db.Column(db.String(150)) #max length of password is 150
    level = db.Column(db.Integer, default=0)
    exp = db.Column(db.Integer, default=0) # Current exp
    max_exp = db.Column(db.Integer, default=100) # Exp required to level up
    date_create = db.Column(db.DateTime(timezone=True), default=func.now()) #record the date the account was created
    tasks = db.relationship('Task', backref='user') #connect User with Task and it can use user to access Task

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    due_date = db.Column(db.Text)
    text_for_done_button = db.Column(db.Text, default="Done")
    #the user must exist to create the task and delete all the task when the user delete the account
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class Account_counter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num_users = db.Column(db.Integer, default=0)