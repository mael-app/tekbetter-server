from datetime import datetime

from app.models.Student import Student


def fill_student_from_intra(intra_json: dict, student: Student):
    for key in ["login", "lastname", "firstname", "credits", "gpa", "promo", "scolaryear", "studentyear"]:
        if key not in intra_json:
            return None
    if len(intra_json["gpa"]) == 0 or "gpa" not in intra_json["gpa"][0]:
        return None
    if student.login != intra_json["login"]:
        raise ValueError("Student login does not match intra login")
    student.last_name = intra_json["lastname"]
    student.first_name = intra_json["firstname"]
    student.scolaryear = int(intra_json["scolaryear"])
    student.scolaryear_id = int(intra_json["studentyear"])
    student.credits = int(intra_json["credits"])
    student.gpa = float(intra_json["gpa"][0]["gpa"])
    student.promo_year = int(intra_json["promo"])
    student.last_update = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if "location" in intra_json:
        if "/" in intra_json["location"]:
            intra_json["location"] = intra_json["location"].split("/")[1]
        student.city = intra_json["location"]
    return student
