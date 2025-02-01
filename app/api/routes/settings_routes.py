from flask import request, make_response

from app.api.middlewares.student_auth_middleware import student_auth_middleware
from app.services.planning_service import PlanningService
from app.services.project_service import ProjectService
from app.services.student_picture_service import StudentPictureService
from app.services.student_service import StudentService


def load_settings_routes(app):
    @app.route("/api/settings", methods=["GET"])
    @student_auth_middleware()
    def settings_get_route():
        student = request.student

        return {
            "share_enabled": student.is_consent_share,
        }


    @app.route("/api/settings", methods=["PUT"])
    @student_auth_middleware()
    def settings_post_route():
        student = request.student

        data = request.json

        if "share_enabled" not in data:
            return {"error": "Missing share_enabled in request"}, 400
        student.is_consent_share = data["share_enabled"]
        StudentService.update_student(student)
        return {"success": True}