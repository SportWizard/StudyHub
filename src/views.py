from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from .models import Task, Account_counter, User
from . import db
from datetime import datetime

views = Blueprint("views", __name__)

#url path. It can either be "/" or "/home"
@views.route("/")
@views.route("/home")
@login_required #only able to access this page/root only if logged in
def home():
    return render_template("home.html", username=current_user.username, level=current_user.level, exp=current_user.exp, max_exp=current_user.max_exp, exp_max_exp=current_user.exp / current_user.max_exp * 100) #render and send user's username to the HTML

@views.route("/to-do-list", methods=["GET", "POST"])
@login_required
def to_do_list():
    if request.method == "POST":
        # Create a task
        text = request.form.get("text")
        due_date = request.form.get("dueDate")

        if not text:
            flash("Task can't be empty.", category="error")
        else:
            task = Task(text=text, due_date=due_date, user_id=current_user.id)
            db.session.add(task)
            db.session.commit()
            flash("Task added", category="success")

    tasks = Task.query.all()

    return render_template("toDoList.html", tasks=tasks, user_id=current_user.id, level=current_user.level, exp=current_user.exp, max_exp=current_user.max_exp, exp_max_exp=current_user.exp / current_user.max_exp * 100)

@views.route("/done-to-do/<id>") #<id> is the id of the task
@login_required
def done_to_do(id):
    task = Task.query.filter_by(id=id).first()

    if not task:
        flash("Task does not exist", category="error")
    else:
        #changing the attribute between "Done" and "Undone"
        if task.text_for_done_button == "Done":
            task.text_for_done_button = "Undone"
        else:
            task.text_for_done_button = "Done"

        db.session.commit() #commit after the attribute is changed

    return redirect(url_for("views.to_do_list"))

@views.route("/delete-to-do/<id>")
@login_required
def delete_to_do(id):
    # Remove the task depending on the id
    task = Task.query.filter_by(id=id).first()

    if not task:
        flash("Task does not exist", category="error")
    else:
        db.session.delete(task) #delete task
        db.session.commit()

        flash("Task deleted", category="success")

    return redirect(url_for("views.to_do_list"))

@views.route("/study-session", methods=["GET", "POST"])
@login_required
def study_session():
    if request.method == "POST":
        # Update exp
        exp = request.json.get("exp")

        user = User.query.filter_by(username=current_user.username).first()
        user.exp += exp

        # If exp reaches or exceeds max_exp, the exceeded exp will remain, the max_exp will increase by 50 and the the user will level up
        if user.exp >= user.max_exp:
            user.exp -= user.max_exp
            user.max_exp += 50
            user.level += 1
        
        db.session.commit()

    return render_template("studySession.html", level=current_user.level, exp=current_user.exp, max_exp=current_user.max_exp, exp_max_exp=current_user.exp / current_user.max_exp * 100)

@views.route("/select-quiz")
@login_required
def select_quiz():
    return render_template("selectQuiz.html")

@views.route("/customization")
@login_required
def customization():
    return render_template("customization.html")

@views.route("/about")
@login_required
def about():
    account_counter = Account_counter.query.first()
    num_users = 0

    if account_counter:
        num_users = account_counter.num_users

    return render_template("about.html", num_users=num_users)