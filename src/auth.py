from flask import Blueprint, render_template, redirect, url_for, request, flash
from . import db
from .models import User
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint("auth", __name__)

#url path
@auth.route("/login", methods=["GET", "POST"]) #get the form input from html
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first() #check the user with the same input username

        if user:
            #check if password (hash) matches the password in the database
            if check_password_hash(user.password, password):
                flash("Logged in")
                login_user(user, remember=True) #login_manager will remember that the user is logged in

                return redirect(url_for("views.home"))
            else:
                flash("Password incorrect.", category="error")
        else:
            flash("Username does not exist.", category="error")

    return render_template("login.html")

@auth.route("/sign-up", methods=["GET", "POST"])
def sign_up():
    if request.method == "POST": #check if the form method is "POST"
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirmPassword")

        user = User.query.filter_by(username=username).first()

        if user:
            flash("Username already taken", category="error")
        elif len(username) < 3:
            flash("Username is too short", category="error")
        elif len(username) > 20:
            flash("Username is too long", category="error")
        elif password != confirm_password:
            flash("Password dont\'t match.", category="error")
        elif len(password) < 6:
            flash("Password is too short.", category="error")
        else:
            # create a new user
            new_user = User(username=username, password=generate_password_hash(password, method='pbkdf2:sha256')) #generate a password hash
            db.session.add(new_user) #add the new user
            db.session.commit() #commit the new user to the database

            login_user(new_user, remember=True)

            flash("User Created")

            return redirect(url_for("views.home"))

    return render_template("signup.html")

@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("auth.login"))