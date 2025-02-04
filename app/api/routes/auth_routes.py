import re
import time

from flask import request

from app.api.middlewares.student_auth_middleware import student_auth_middleware
from app.models.Student import Student
from app.services.redis_service import RedisService
from app.services.student_service import StudentService
from app.tools.jwt_engine import generate_jwt
from app.tools.password_tools import check_password, hash_password

PASSWORD_REGEX = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"


def load_auth_routes(app):
    @app.route("/api/auth/email", methods=["POST"])
    def login_with_email_route():
        data = request.json
        email = data.get("email")

        if email is None:
            return {"error": "Missing email"}, 400

        student = StudentService.get_student_by_login(email)
        if student is None:
            ticket = StudentService.create_register_ticket(email)
            return {"status": "register"}, 200

        return {"status": "login"}, 200

    @app.route("/api/auth/login", methods=["POST"])
    def validate_email_login():
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if email is None or password is None:
            return {"error": "Missing email or password"}, 400

        student = StudentService.get_student_by_login(email)
        if student is None:
            return {"error": "Invalid email or password"}, 400

        # Check if it's password reset
        redis_key = f"reset_password:{student.id}"
        reset_password = RedisService.get(redis_key)
        if reset_password is not None:
            if password == reset_password:
                # Reset password
                new_pass_hash = hash_password(password)
                student.password_hash = new_pass_hash
                StudentService.update_student(student)
                RedisService.delete(redis_key)
                token = StudentService.generate_jwt_token(student)
                return {"token": token}, 200

        if not check_password(password, student.password_hash):
            return {"error": "Invalid email or password"}, 400

        token = StudentService.generate_jwt_token(student)
        return {"token": token}, 200

    @app.route("/api/auth/register", methods=["POST"])
    def register_student():
        data = request.json

        ticket = data.get("ticket", None)
        if ticket is None:
            return {"error": "Missing ticket"}, 400
        password = data.get("password", None)
        if password is None or not re.match(PASSWORD_REGEX, password):
            return {"error": "Invalid password"}, 400

        student = StudentService.create_student_by_ticket(ticket, password)
        if student is None:
            return {"error": "Invalid ticket"}, 400

        token = StudentService.generate_jwt_token(student)
        return {"token": token}, 200

    @app.route("/api/auth/ticket", methods=["POST"])
    def check_ticket():
        data = request.json
        ticket = data.get("ticket", None)
        if ticket is None:
            return {"error": "Missing ticket"}, 400

        user = StudentService.get_ticket_email(ticket)
        if user is None:
            return {"error": "Invalid ticket"}, 400

        return {"login": user}, 200

    @app.route("/api/auth/reset", methods=["POST"])
    def reset_password():
        data = request.json
        email = data.get("email", None)
        if email is None:
            return {"error": "Missing email"}, 400

        student = StudentService.get_student_by_login(email)
        if student is None:
            return {"error": "Invalid email"}, 400

        StudentService.send_reset_password_email(email)
        return {"success": True}, 200

    @app.route("/api/auth/change", methods=["POST"])
    @student_auth_middleware()
    def change_password():
        data = request.json
        student = request.student

        old_password = data.get("oldPassword", None)
        new_password = data.get("newPassword", None)

        if old_password is None or new_password is None:
            return {"error": "Missing old or new password"}, 400

        if not check_password(old_password, student.password_hash):
            return {"error": "Invalid old password"}, 400

        if not re.match(PASSWORD_REGEX, new_password):
            return {"error": "Invalid new password"}, 400

        new_pass_hash = hash_password(new_password)
        student.password_hash = new_pass_hash
        StudentService.update_student(student)

        return {"success": True}, 200
