from flask import request

from app.api.middlewares.student_auth_middleware import student_auth_middleware
from app.models.MouliTest import MouliResult
from app.services.mouli_service import MouliService


def load_mouli_routes(app):
    @app.route("/api/mouli/project/<string:project_slug>", methods=["GET"])
    @student_auth_middleware()
    def mouli_get_route(project_slug: str):
        student = request.student

        history: [MouliResult] = MouliService.get_project_moulis(project_slug,
                                                                 student.id)
        return [{
            "test_id": mouli.test_id,
            "score": mouli.score,
            "date": mouli.test_date,
        } for mouli in history]

    @app.route("/api/mouli/test/<int:test_id>", methods=["GET"])
    @student_auth_middleware()
    def mouli_test_route(test_id: int):
        student = request.student

        test = MouliService.get_mouli_by_id(test_id, student.id)

        if student.is_consent_share:
            MouliService.fill_passed_users(test, student.promo_year, student.city)
        return test.to_api()
