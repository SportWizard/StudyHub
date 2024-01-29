from flask import Blueprint, render_template
from flask_login import login_required, current_user

views = Blueprint("views", __name__)

#url path. It can either be "/" or "/home"
@views.route("/")
@views.route("/home")
@login_required #only able to access this page/root only if logged in
def home():
    return render_template("home.html", username=current_user.username) #render and send user's username to the HTML