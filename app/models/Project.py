from app.services.mouli_service import MouliService


class Project:
    _id: str = None

    code_acti: str
    student_id: str
    title: str

    date_start: str
    date_end: str

    code_module: str
    title_module: str
    scolar_year: int
    code_instance: str
    mouli_seen: bool = True

    fetch_date: str

    mouli_project_code: str | None = None
    slug: str | None = None

    def __init__(self, mongo_data=None):
        if mongo_data is None:
            return
        self._id = mongo_data["_id"]
        self.code_acti = mongo_data["code_acti"]
        self.student_id = mongo_data["student_id"]
        self.date_start = mongo_data["date_start"]
        self.date_end = mongo_data["date_end"]
        self.code_module = mongo_data["code_module"]
        self.title = mongo_data["title"]
        self.title_module = mongo_data["title_module"]
        self.fetch_date = mongo_data["fetch_date"]
        self.slug = mongo_data.get("slug", None)

        self.scolar_year = mongo_data.get("scolar_year", None)
        self.code_instance = mongo_data.get("code_instance", None)
        self.mouli_seen = mongo_data.get("mouli_seen", True)
        self.mates_logins = mongo_data.get("mates_logins", [])
    def to_dict(self):
        return {
            "_id": self._id,
            "code_acti": self.code_acti,
            "student_id": self.student_id,
            "date_start": self.date_start,
            "date_end": self.date_end,
            "code_module": self.code_module,
            "title_module": self.title_module,
            "title": self.title,
            "fetch_date": self.fetch_date,
            "slug": self.slug,
            "scolar_year": self.scolar_year,
            "code_instance": self.code_instance,
            "mouli_seen": self.mouli_seen,
            "mates_logins": self.mates_logins
        }

    def to_api(self):
        latest_mouli = MouliService.get_latest_of_project(self.slug,
                                                          self.student_id)

        return {
            "code_acti": self.code_acti,
            "date_start": self.date_start,
            "date_end": self.date_end,
            "code_module": self.code_module,
            "title_module": self.title_module,
            "title": self.title,
            "fetch_date": self.fetch_date,
            "slug": self.slug,
            "mouli_seen": self.mouli_seen,
            "mates_logins": self.mates_logins,
            "mouli": {
                "test_id": latest_mouli.test_id,
                "score": latest_mouli.score,
                "date": latest_mouli.test_date,
                "is_warning": latest_mouli.is_warning()
            } if latest_mouli else None
        }

    @property
    def mongo_id(self):
        return self._id
