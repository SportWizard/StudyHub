from flask import Blueprint, render_template, redirect, url_for, request, flash
from . import db
from .models import User, Account_counter
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

    account_counter = Account_counter.query.first()

    if not account_counter:
        num_users = Account_counter()
        db.session.add(num_users)
        db.session.commit()

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

            account_counter = Account_counter.query.first()
            account_counter.num_users += 1

            db.session.commit() #commit the new user to the database

            login_user(new_user, remember=True)

            flash("User Created")

            return redirect(url_for("views.home"))

    return render_template("signup.html")

@auth.route("/settings", methods=["GET", "POST"])
@login_required
def settings():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirmPassword")

        user = User.query.filter_by(username=current_user.username).first()

        has_password = True

        #check if the user inputed a new username
        if len(username) == 0:
            username = current_user.username

        #check if the user inputed a new password
        if len(password) == 0:
            has_password = False

        if len(username) < 3:
            flash("Username is too short", category="error")
        elif len(username) > 20:
            flash("Username is too long", category="error")
        elif password != confirm_password:
            flash("Password dont\'t match.", category="error")
        elif len(password) < 6 and has_password:
            flash("Password is too short.", category="error")
        else:
            user.username = username

            if has_password:
                user.password = generate_password_hash(password, method='pbkdf2:sha256')

            db.session.commit()

            flash("Setting updated")

            return redirect(url_for("views.home"))

    return render_template("settings.html", username=current_user.username)

@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("auth.login"))

@auth.route("/delete-account")
@login_required
def delete_account():
    user = User.query.filter_by(username=current_user.username).first()

    db.session.delete(user) #delete user's account
    db.session.commit()

    account_counter = Account_counter.query.first()

    if account_counter:
        account_counter.num_users -= 1
        db.session.commit()

    flash("Account deleted", category="success")

    return redirect((url_for("auth.login")))