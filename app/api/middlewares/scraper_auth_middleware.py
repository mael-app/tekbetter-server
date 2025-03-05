from functools import wraps
from flask import request
from redis import Redis

from app.services.publicscraper_service import PublicScraperService
from app.services.redis_service import RedisService
from app.services.student_service import StudentService


def scraper_auth_middleware(only_login=False):
    def _scraper_auth_middleware(f):
        @wraps(f)
        def __scraper_auth_middleware(*args, **kwargs):
            scraper_token = request.headers.get("Authorization")
            if not scraper_token:
                return {"message": "Missing authorization header"}, 401
            scraper_token = scraper_token.replace("Bearer ", "")
            if (only_login):
                student_login = RedisService.get(f"scrapertoken_logincache:{scraper_token}")
                if not student_login:
                    student = StudentService.get_student_by_scrapetoken(scraper_token)
                    if not student:
                        return {"message": "Invalid authorization header"}, 401
                    RedisService.set(f"scrapertoken_logincache:{scraper_token}", student.login, 300)
                request.student_login = student_login
                return f(*args, **kwargs)
            student = StudentService.get_student_by_scrapetoken(scraper_token)
            if not student:
                return {"message": "Invalid authorization header"}, 401
            request.student = student
            return f(*args, **kwargs)
        return __scraper_auth_middleware
    return _scraper_auth_middleware

def public_scraper_auth_middleware():
    def _public_craper_auth_middleware(f):
        @wraps(f)
        def __public_scraper_auth_middleware(*args, **kwargs):
            scraper_token = request.headers.get("Authorization")
            if not scraper_token:
                return {"message": "Missing authorization header"}, 401
            scraper_token = scraper_token.replace("Bearer ", "")
            scraper = PublicScraperService.get_scraper_by_accesstoken(scraper_token)
            if not scraper:
                return {"message": "Invalid authorization header"}, 401
            request.scraper = scraper
            return f(*args, **kwargs)
        return __public_scraper_auth_middleware
    return _public_craper_auth_middleware