class Module:
    _id: str = None
    student_id: str

    code_module: str
    module_id: int
    semester_id: int
    instance_code: str
    scol_year: int
    title: str

    date_start: str
    date_end_registration: str
    registration_allowed: bool
    student_registered: bool
    date_end: str

    student_credits: int
    student_grade: str
    credits: int

    wanted_credits: int = 0

    is_roadblock: bool = False
    roadblock_submodules: list = None
    roadblock_required_credits: int or None = None

    fetch_date: str

    def __init__(self, mongo_data=None):
        if mongo_data is None:
            return
        self._id = mongo_data["_id"]
        self.student_id = mongo_data.get("student_id", None)
        self.code_module = mongo_data.get("code_module", None)
        self.module_id = mongo_data.get("module_id", None)
        self.instance_code = mongo_data.get("instance_code", None)
        self.semester_id = mongo_data.get("semester_id", None)

        self.scol_year = mongo_data.get("scol_year", None)
        self.title = mongo_data.get("title", None)
        self.date_start = mongo_data.get("date_start", None)
        self.date_end_registration = mongo_data.get("date_end_registration", None)
        self.registration_allowed = mongo_data.get("registration_allowed", None)
        self.student_registered = mongo_data.get("student_registered", None)
        self.date_end = mongo_data.get("date_end", None)
        self.student_credits = mongo_data.get("student_credits", None)
        self.student_grade = mongo_data.get("student_grade", None)
        self.credits = mongo_data.get("credits", None)
        self.wanted_credits = mongo_data.get("wanted_credits", 0)

        self.is_roadblock = mongo_data.get("is_roadblock", False)
        self.roadblock_submodules = mongo_data.get("roadblock_submodules", None)
        self.roadblock_required_credits = mongo_data.get("roadblock_required_credits", None)

        self.fetch_date = mongo_data.get("fetch_date", None)




    def to_dict(self):
        return {
            "_id": self._id,
            "student_id": self.student_id,
            "code_module": self.code_module,
            "module_id": self.module_id,
            "instance_code": self.instance_code,
            "semester_id": self.semester_id,
            "scol_year": self.scol_year,
            "title": self.title,
            "date_start": self.date_start,
            "date_end_registration": self.date_end_registration,
            "registration_allowed": self.registration_allowed,
            "student_registered": self.student_registered,
            "date_end": self.date_end,
            "student_credits": self.student_credits,
            "student_grade": self.student_grade,
            "credits": self.credits,
            "wanted_credits": self.wanted_credits,
            "is_roadblock": self.is_roadblock,
            "roadblock_submodules": self.roadblock_submodules,
            "roadblock_required_credits": self.roadblock_required_credits,
            "fetch_date": self.fetch_date
        }

    def to_api(self):
        return {
            "code_module": self.code_module,
            "semester_id": self.semester_id,
            "module_id": self.module_id,
            "scol_year": self.scol_year,
            "instance_code": self.instance_code,
            "title": self.title,
            "date_start": self.date_start,
            "date_end_registration": self.date_end_registration,
            "registration_allowed": self.registration_allowed,
            "student_registered": self.student_registered,
            "date_end": self.date_end,
            "student_credits": self.student_credits,
            "student_grade": self.student_grade,
            "credits": self.credits,
            "wanted_credits": self.wanted_credits,
            "is_roadblock": self.is_roadblock,
            "roadblock_submodules": self.roadblock_submodules,
            "roadblock_required_credits": self.roadblock_required_credits,
            "fetch_date": self.fetch_date
        }

    @property
    def mongo_id(self):
        return self._id
