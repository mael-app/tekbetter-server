from typing import Dict, List


class MouliTest:
    title: str
    passed: bool
    crashed: bool
    skipped: bool
    mandatory: bool
    passed_students: [str] = []
    comment: str

    def __init__(self, mongodata=None):
        if mongodata is None:
            return
        self.title = mongodata["title"]
        self.passed = mongodata["passed"]
        self.crashed = mongodata["crashed"]
        self.skipped = mongodata["skipped"]
        self.mandatory = mongodata["mandatory"]
        self.comment = mongodata["comment"]

    def to_dict(self):
        return {
            "title": self.title,
            "passed": self.passed,
            "crashed": self.crashed,
            "skipped": self.skipped,
            "mandatory": self.mandatory,
            "comment": self.comment
        }

    def to_api(self):
        return {
            "name": self.title,
            "is_passed": self.passed,
            "is_crashed": self.crashed,
            "is_skipped": self.skipped,
            "is_mandatory": self.mandatory,
            "comment": self.comment,
            "passed_students": [str(student) for student in self.passed_students]
        }


class MouliSkill:
    title: str
    tests_count: int
    passed_count: int
    crash_count: int
    mandatoryfail_count: int
    passed_students: [str] = []

    tests: [MouliTest]

    def __init__(self, mongodata=None):
        if mongodata is None:
            return
        self.title = mongodata["title"]
        self.tests_count = mongodata["tests_count"]
        self.passed_count = mongodata["passed_count"]
        self.crash_count = mongodata["crash_count"]
        self.mandatoryfail_count = mongodata["mandatoryfail_count"]
        self.tests = [MouliTest(test) for test in mongodata["tests"]] if \
        mongodata["tests"] is not None else None

    @property
    def score(self):
        return round(self.passed_count / self.tests_count * 100, 2)

    def to_dict(self):
        return {
            "title": self.title,
            "score": self.score,
            "tests_count": self.tests_count,
            "passed_count": self.passed_count,
            "crash_count": self.crash_count,
            "mandatoryfail_count": self.mandatoryfail_count,
            "tests": [test.to_dict() for test in
                      self.tests] if self.tests is not None else None
        }

    def to_api(self):
        return {
            "title": self.title,
            "score": self.score,
            "tests_count": self.tests_count,
            "passed_count": self.passed_count,
            "crash_count": self.crash_count,
            "mandatoryfail_count": self.mandatoryfail_count,
            "tests": [test.to_api() for test in
                      self.tests] if self.tests is not None else None,
            "passed_students": [str(student) for student in self.passed_students]

        }


class CodingStyleReport:
    minor_issues: int = 0
    major_issues: int = 0
    info_issues: int = 0
    is_too_many_issues: bool = False

    # Violation code : [file path and line]
    details: Dict[str, Dict[str, List[str] | int]] = {
        "minor": {},
        "major": {},
        "info": {}
    }

    def __init__(self, mongodata=None):
        if mongodata is None:
            return
        self.minor_issues = mongodata["minor_issues"]
        self.major_issues = mongodata["major_issues"]
        self.info_issues = mongodata["info_issues"]
        self.is_too_many_issues = mongodata["is_too_many_issues"]
        self.details = mongodata["details"]

    def to_dict(self) -> dict:
        return {
            "minor_issues": self.minor_issues,
            "major_issues": self.major_issues,
            "info_issues": self.info_issues,
            "is_too_many_issues": self.is_too_many_issues,
            "details": self.details
        }


class MouliResult:
    _id: str = None
    test_id: int
    project_name: str
    project_code: str
    module_code: str
    test_date: str
    commit_hash: str | None
    student_id: str

    build_trace: str | None
    make_trace: str | None
    banned_content: str | None
    delivery_error: bool = False
    skills: [MouliSkill]

    coverage_lines: int = 0
    coverage_branches: int = 0

    coding_style_report: CodingStyleReport

    def __init__(self, mongodata=None):
        if mongodata is None:
            return
        self._id = mongodata["_id"]
        self.test_id = mongodata["test_id"]
        self.project_name = mongodata["project_name"]
        self.project_code = mongodata["project_code"]
        self.module_code = mongodata["module_code"]
        self.student_id = str(mongodata["student_id"])
        self.test_date = mongodata["test_date"]
        self.commit_hash = mongodata["commit_hash"]
        self.build_trace = mongodata["build_trace"]
        self.make_trace = mongodata["make_trace"] if "make_trace" in mongodata else None
        self.is_build_failed = mongodata["build_failed"] if "build_failed" in mongodata else False
        self.delivery_error = mongodata["delivery_error"]
        self.banned_content = mongodata["banned_content"]
        self.skills = [MouliSkill(skill) for skill in mongodata["skills"]]
        self.coverage_lines = mongodata["coverage_lines"] if "coverage_lines" in mongodata else 0
        self.coverage_branches = mongodata["coverage_branches"] if "coverage_branches" in mongodata else 0
        self.coding_style_report = CodingStyleReport(
            mongodata["coding_style_report"])

    @property
    def score(self):
        total_tests = sum([skill.tests_count for skill in self.skills])
        passed_tests = sum([skill.passed_count for skill in self.skills])
        if total_tests == 0:
            return 0
        return round(passed_tests / total_tests * 100, 2)

    def is_warning(self):
        if self.is_build_failed:
            return True
        if self.delivery_error:
            return True
        for skill in self.skills:
            if skill.mandatoryfail_count > 0:
                return True
            if skill.crash_count > 0:
                return True
        return False

    def to_dict(self) -> dict:
        return {
            "_id": self._id,
            "test_id": self.test_id,
            "project_name": self.project_name,
            "project_code": self.project_code,  # slug
            "module_code": self.module_code,
            "student_id": self.student_id,
            "score": self.score,
            "delivery_error": self.delivery_error,
            "build_failed": self.is_build_failed,
            "test_date": self.test_date,
            "commit_hash": self.commit_hash,
            "build_trace": self.build_trace,
            "make_trace": self.make_trace,
            "banned_content": self.banned_content,
            "skills": [skill.to_dict() for skill in self.skills],
            "coding_style_report": self.coding_style_report.to_dict(),
            "coverage_lines": self.coverage_lines,
            "coverage_branches": self.coverage_branches
        }

    def to_api(self):
        from app.services.mouli_service import MouliService
        evolution = MouliService.build_evolution(self)

        return {
            "test_id": self.test_id,
            "project_name": self.project_name,
            "project_code": self.project_code,
            "module_code": self.module_code,
            "student_id": self.student_id,
            "score": self.score,
            "delivery_error": self.delivery_error,
            "is_build_failed": self.is_build_failed,
            "test_date": self.test_date,
            "commit_hash": self.commit_hash,
            "evolution": {
                "dates": evolution[0],
                "scores": evolution[1],
                "ids": evolution[2]
            },
            "build_trace": self.build_trace,
            "make_trace": self.make_trace,
            "banned_content": self.banned_content,
            "skills": [skill.to_api() for skill in self.skills],
            "coding_style_report": self.coding_style_report.to_dict(),
            "coverage_lines": self.coverage_lines,
            "coverage_branches": self.coverage_branches
        }

    @property
    def mongo_id(self):
        return self._id
