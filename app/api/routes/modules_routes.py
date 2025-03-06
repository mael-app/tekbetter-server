from flask import request

from app.api.middlewares.student_auth_middleware import student_auth_middleware
from app.services.module_service import ModuleService
from app.services.project_service import ProjectService


def load_module_routes(app):
    @app.route("/api/modules", methods=["GET"])
    @student_auth_middleware()
    def modules_route():
        student = request.student

        modules = ModuleService.get_student_modules(student.id)
        m_api = [m.to_api() for m in modules]
        return {
            "modules": m_api,
            "credits": student.credits,
            "gpa": student.gpa,
            "current_year": student.scolaryear,
            "current_year_id": student.scolaryear_id,
            "required_credits": student.required_credits
        }

    @app.route("/api/modules/<int:module_id>", methods=["POST"])
    @student_auth_middleware()
    def module_update_route(module_id):
        student = request.student

        module = ModuleService.get_module_by_id(student.id, module_id)
        if not module:
            return {"message": "Module not found"}, 404
        data = request.get_json()
        if "wanted_credits" in data:
            module.wanted_credits = data["wanted_credits"]
        ModuleService.upload_module(module)
        return {"message": "Module updated"}