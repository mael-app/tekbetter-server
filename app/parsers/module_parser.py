from datetime import datetime

from app.models.Module import Module
from app.models.Project import Project


def fill_module_from_intra(intra_json: dict, module: Module,
                            student_id: int):
    for key in ["id", "codemodule", "semester", "scolaryear", "title", "begin", "end", "end_register", "student_credits", "student_grade", "credits", "allow_register", "student_registered", "tb_is_roadblock", "tb_roadblock_submodules", "tb_required_credits", "codeinstance"]:
        if key not in intra_json:
            return False
    module.student_id = student_id
    module.module_id = intra_json["id"]
    module.code_module = intra_json["codemodule"]
    module.instance_code = intra_json["codeinstance"]
    module.semester_id = intra_json["semester"]
    module.scol_year = intra_json["scolaryear"]
    module.title = intra_json["title"]
    module.date_start = intra_json["begin"]
    module.date_end = intra_json["end"]
    module.date_end_registration = intra_json["end_register"]
    module.registration_allowed = str(intra_json["allow_register"]) == "1"
    module.student_registered = str(intra_json["student_registered"]) == "1"


    module.student_credits = intra_json["student_credits"]
    module.student_grade = intra_json["student_grade"]
    module.credits = intra_json["credits"]

    module.is_roadblock = intra_json["tb_is_roadblock"]
    module.roadblock_submodules = intra_json["tb_roadblock_submodules"]
    module.roadblock_required_credits = intra_json["tb_required_credits"]

    module.fetch_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return True
