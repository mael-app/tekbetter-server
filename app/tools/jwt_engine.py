import datetime
import os
import jwt
from app.models.Student import Student



def generate_jwt(student: Student, expiration):
    jwt_secret = os.getenv("JWT_SECRET")

    return jwt.encode({
        "student_id": str(student.id),
        "login": student.login,
        "created_at": str(datetime.datetime.now()),
        "exp": expiration
    }, jwt_secret, algorithm="HS256")


def decode_jwt(token):
    try:
        jwt_secret = os.getenv("JWT_SECRET")
        return jwt.decode(token, jwt_secret, algorithms=["HS256"])
    except Exception:
        return None
