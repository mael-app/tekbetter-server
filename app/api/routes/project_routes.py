from concurrent.futures import ThreadPoolExecutor

from flask import request

from app.api.middlewares.student_auth_middleware import student_auth_middleware
from app.services.project_service import ProjectService


def load_project_routes(app):
    @app.route("/api/projects", methods=["GET"])
    @student_auth_middleware()
    def projects_route():
        student = request.student
        params = request.args
        projects = ProjectService.get_student_projects(student.id, params.get("mouli_only", False))

        def project_to_api(project):
            return project.to_api()

        with ThreadPoolExecutor() as executor:
            result = list(executor.map(project_to_api, projects))
        return result

    @app.route("/api/projects/<string:proj_slug>/mark-seen", methods=["POST"])
    @student_auth_middleware()
    def mark_project_seen_route(proj_slug):
        student = request.student

        project = ProjectService.get_project_by_slug(student.id, proj_slug)
        project.mouli_seen = True
        ProjectService.upload_project(project)
        return {"success": True}

    @app.route("/api/projects/mark-all-seen", methods=["POST"])
    @student_auth_middleware()
    def mark_all_projects_seen_route():
        student = request.student
        ProjectService.make_all_project_as_seen(student.id)
        return {"success": True}
