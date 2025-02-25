from app.models.MouliTest import MouliResult, CodingStyleReport, MouliSkill, \
    MouliTest


def _build_coding_style(mouli_json: dict) -> CodingStyleReport:
    coding_style = CodingStyleReport()

    v = [i['value'] for i in mouli_json["externalItems"] if
         i['type'] == "coding-style-fail" and i['value'] == 1]
    if len(v) > 0:
        coding_style.is_too_many_issues = True

    if "style" in mouli_json and (
            "Details" in mouli_json["style"] or "Counts" in mouli_json[
        "style"]):
        key = "Counts" if "Counts" in mouli_json["style"] else "Details"
        details = mouli_json["style"][key]
        coding_style.details["minor"] = details[
            "minor"] if "minor" in details else {}
        coding_style.details["major"] = details[
            "major"] if "major" in details else {}
        coding_style.details["info"] = details[
            "info"] if "info" in details else {}

    return coding_style


def _build_test(test_json: dict) -> MouliTest:
    test = MouliTest()
    test.title = test_json["name"]
    test.passed = test_json["passed"]
    test.crashed = test_json["crashed"]
    test.skipped = test_json["skipped"]
    test.mandatory = test_json["mandatory"]
    test.comment = test_json["comment"]
    return test


def _build_skill(skill_json: dict) -> MouliSkill:
    skill = MouliSkill()
    tests_shown = "FullSkillReport" in skill_json
    skill_json = skill_json["FullSkillReport"] if tests_shown else skill_json[
        "BreakdownSkillReport"]

    if tests_shown:
        if "tests" in skill_json:
            skill.tests = [_build_test(test) for test in skill_json["tests"]]
            skill.tests_count = len(skill.tests)
            skill.passed_count = len(
                [test for test in skill.tests if test.passed])
            skill.crash_count = len(
                [test for test in skill.tests if test.crashed])
            skill.mandatoryfail_count = len([test for test in skill.tests if
                                             not test.passed and test.mandatory])
    else:
        skill.tests = None
        skill.tests_count = skill_json["breakdown"]["count"]
        skill.passed_count = skill_json["breakdown"]["passed"]
        skill.crash_count = skill_json["breakdown"]["crashed"]
        skill.mandatoryfail_count = skill_json["breakdown"]["mandatoryFailed"]

    skill.title = skill_json["name"]
    return skill

def _get_external_item(mouli_json: dict, type: str) -> (float, str):
    for item in mouli_json["externalItems"]:
        if "type" in item and item["type"] == type:
            value = item["value"] if "value" in item else None
            comment = item["comment"] if "comment" in item else None
            return value, comment
    return None, None

def build_mouli_from_myepitech(test_id: int, mouli_json: dict,
                               student_id: int) -> MouliResult:
    mouli = MouliResult()

    mouli.project_name = mouli_json["instance"]["projectName"]
    mouli.project_code = mouli_json["instance"]["projectSlug"]

    mouli.module_code = mouli_json["instance"]["moduleCode"]

    mouli.test_date = mouli_json["date"]
    mouli.test_id = test_id
    mouli.commit_hash = mouli_json.get("gitCommit", "")

    _, test_trace = _get_external_item(mouli_json, "trace-pool")
    _, make_trace = _get_external_item(mouli_json, "make-error")

    cov_lines, _ = _get_external_item(mouli_json, "coverage.lines")
    mouli.coverage_lines = cov_lines

    cov_branches, _ = _get_external_item(mouli_json, "coverage.branches")
    mouli.coverage_branches = cov_branches

    mouli.build_trace = test_trace
    mouli.make_trace = make_trace
    mouli.is_build_failed = make_trace is not None

    mouli.banned_content = [i['comment'] for i in mouli_json["externalItems"]
                            if i['type'] == "banned"]
    mouli.delivery_error = len([i for i in mouli_json["externalItems"] if
                                i['type'] == "delivery-error"]) > 0
    if len(mouli.banned_content) == 0:
        mouli.banned_content = None
    else:
        mouli.banned_content = mouli.banned_content[0]

    mouli.coding_style_report = _build_coding_style(mouli_json)

    if "skills" in mouli_json:
        mouli.skills = [_build_skill(skill) for skill in mouli_json["skills"]]
        mouli.skills = [skill for skill in mouli.skills if skill is not None]
    else:
        mouli.skills = None

    mouli.student_id = student_id

    return mouli
