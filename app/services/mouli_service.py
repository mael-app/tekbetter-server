import base64
import json
import uuid
from datetime import datetime
from app.globals import Globals
from app.models.MouliTest import MouliResult, MouliTest, MouliSkill
from app.services.redis_service import RedisService
from app.services.student_service import StudentService
from app.tools.teklogger import log_info, log_success


class MouliService:

    @staticmethod
    def get_mouli_by_id(test_id: int, student_id: str) -> MouliResult:
        mouli = Globals.database["moulis"].find_one(
            {"test_id": str(test_id), "student_id": student_id})
        return MouliResult(mouli) if mouli else None

    @staticmethod
    def get_latest_of_project(project_slug: str,
                              student_id: str) -> MouliResult:
        mouli = Globals.database["moulis"].find_one(
            {"project_code": project_slug, "student_id": student_id},
            sort=[("test_date", -1)])
        if mouli:
            return MouliResult(mouli)
        return None

    @staticmethod
    def get_project_moulis(project_slug: str, student_id: str) -> [
        MouliResult]:
        moulis = Globals.database["moulis"].find(
            {"project_code": project_slug, "student_id": student_id})
        return [MouliResult(m) for m in moulis]

    @staticmethod
    def build_evolution(mouli: MouliResult) -> [MouliResult]:
        all_moulis = [MouliResult(m) for m in Globals.database["moulis"].find(
            {"student_id": mouli.student_id,
             "project_code": mouli.project_code})]
        all_moulis.sort(key=lambda m: m.test_date)
        result = ([], [], [])
        for m in all_moulis:
            result[0].append(m.test_date)
            result[1].append(m.score)
            result[2].append(m.test_id)
        return result


    @staticmethod
    def get_student_moulis(student_id: str) -> [MouliResult]:
        moulis = Globals.database["moulis"].find({"student_id": student_id})
        return [MouliResult(m) for m in moulis]

    @staticmethod
    def get_student_mouliids(student_id: int) -> [int]:
        return [int(mouli["test_id"]) for mouli in
                Globals.database["moulis"].find({"student_id": student_id})]

    @staticmethod
    def delete_mouli(mouli: MouliResult):
        Globals.database["moulis"].delete_one({"_id": mouli.mongo_id})

    @staticmethod
    def upload_mouli(mouli: MouliResult):
        student = StudentService.get_student_by_id(mouli.student_id)
        current = MouliService.get_mouli_by_id(mouli.test_id, mouli.student_id)
        if current:
            new_data = current.to_dict()
            new_data["_id"] = current.mongo_id
            Globals.database["moulis"].update_one({"_id": current.mongo_id},
                                                  {"$set": new_data})
        else:
            from app.services.project_service import ProjectService
            mouli._id = uuid.uuid4().hex
            Globals.database["moulis"].insert_one(mouli.to_dict())
            proj = ProjectService.get_project_by_slug(mouli.student_id, mouli.project_code)
            if proj:
                proj.mouli_seen = False
                ProjectService.upload_project(proj)
        MouliService.cache_passed_tests(mouli, student.promo_year, student.city)
        return mouli

    @staticmethod
    def fill_passed_users(mouli: MouliResult, promyear: int, city: str):
        for skill in mouli.skills:
            usrs = RedisService.get(f"{promyear}:{city}:{mouli.project_code}:{base64.b64encode(skill.title.encode()).decode()}")
            usrs = json.loads(usrs) if usrs else []
            usrs = StudentService.filter_share_consent(usrs)
            skill.passed_students = usrs if usrs else []
            if skill.tests is not None:
                for test in skill.tests:
                    usrs = RedisService.get(f"{promyear}:{city}:{mouli.project_code}:{base64.b64encode(skill.title.encode()).decode()}:{base64.b64encode(test.title.encode()).decode()}")
                    usrs = json.loads(usrs) if usrs else []
                    usrs = StudentService.filter_share_consent(usrs) if usrs else []
                    test.passed_students = usrs if usrs else []

    @staticmethod
    def refresh_all_cache():
        log_info("Refreshing all test-passed cache")
        students = StudentService.get_all_students()
        for student in students:
            by_slugs = {}
            latests = []
            moulis = MouliService.get_student_moulis(student.id)
            for mouli in moulis:
                if mouli.project_code not in by_slugs:
                    by_slugs[mouli.project_code] = []
                by_slugs[mouli.project_code].append(mouli)
                by_slugs[mouli.project_code].sort(key=lambda m: m.test_id, reverse=True)
            for slug in by_slugs:
                if len(by_slugs[slug]) > 0:
                    latests.append(by_slugs[slug][0])
            i = 0
            for mouli in latests:
                i += 1
                MouliService.cache_passed_tests(mouli=mouli, promyear=student.promo_year, city=student.city)
            log_success(f"Refreshed cache for student {student.login} ({i} tests)")

    @staticmethod
    def cache_passed_tests(mouli: MouliResult, promyear: int, city: str) -> dict:
        # promyear:slug:skill
        # promyear:slug:skill:test_title
        passed = {}

        for skill in mouli.skills:
            passed[f"{promyear}:{city}:{mouli.project_code}:{base64.b64encode(skill.title.encode()).decode()}"] = skill.score == 100
            if skill.tests is not None:
                for test in skill.tests:
                    passed[f"{promyear}:{city}:{mouli.project_code}:{base64.b64encode(skill.title.encode()).decode()}:{base64.b64encode(test.title.encode()).decode()}"] = test.passed

        # Update redis
        pass
        for key, value in passed.items():
            current_students = RedisService.get(key)

            if current_students is None:
                current_students = []
            else:
                current_students = json.loads(current_students)
            if mouli.student_id not in current_students and value:
                current_students.append(mouli.student_id)
            if mouli.student_id in current_students and not value:
                current_students.remove(mouli.student_id)
            RedisService.set(key, json.dumps(current_students))

        return passed
