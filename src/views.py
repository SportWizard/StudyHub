from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from .models import Task
from . import db

views = Blueprint("views", __name__)

#url path. It can either be "/" or "/home"
@views.route("/")
@views.route("/home")
@login_required #only able to access this page/root only if logged in
def home():
    return render_template("home.html", username=current_user.username) #render and send user's username to the HTML

@views.route("/to-do-list", methods=["GET", "POST"])
@login_required
def to_do_list():
    if request.method == "POST":
        text = request.form.get("text")

        if not text:
            flash("Task can't be empty.", category="error")
        else:
            task = Task(text=text, user_id=current_user.id)
            db.session.add(task)
            db.session.commit()
            flash("Task added", category="success")

    tasks = Task.query.all()

    return render_template("toDoList.html", tasks=tasks)

@views.route("/delete-to-do/<id>")
@login_required
def delete_to_do(id):
    task = Task.query.filter_by(id=id).first()

    if not task:
        flash("Task does not exist", category="error")
    else:
        db.session.delete(task)
        db.session.commit()
        flash("Task deleted", category="success")

    return redirect(url_for("views.to_do_list"))