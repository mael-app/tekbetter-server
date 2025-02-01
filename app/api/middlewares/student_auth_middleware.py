from datetime import datetime
from functools import wraps
from flask import request
from app.services.student_service import StudentService
from app.tools.jwt_engine import decode_jwt

def student_auth_middleware():
    def _student_auth_middleware(f):
        @wraps(f)
        def __student_auth_middleware(*args, **kwargs):
            auth_token = request.headers.get("Authorization")
            if not auth_token:
                return {"message": "Missing authorization header"}, 401
            auth_token = auth_token.replace("Bearer ", "")
            jwt_decoded = decode_jwt(auth_token)
            if not jwt_decoded:
                return {"message": "Invalid authorization header"}, 401
            # Check expiration
            if jwt_decoded["exp"] < int(datetime.now().timestamp()):
                return {"message": "Token expired"}, 401

            student_id = str(jwt_decoded["student_id"])
            student = StudentService.get_student_by_id(student_id)
            if not student:
                return {"message": "Invalid authorization header"}, 401
            request.student = student
            return f(*args, **kwargs)
        return __student_auth_middleware
    return _student_auth_middleware
