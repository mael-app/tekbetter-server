class Student:
    _id: str = None
    login: str
    password_hash: str = None
    first_name: str = None
    last_name: str = None
    city: str = "Epitech"
    promo_year: int = None
    scolaryear: int = None
    scolaryear_id: int = None
    credits: int = None
    gpa: float = None
    scraper_token: str = None
    microsoft_session: str = None
    public_scraper_id: str = None

    is_consent_share: bool = True

    last_update: str = None

    def to_dict(self):
        return {
            "_id": self._id,
            "login": self.login,
            "password_hash": self.password_hash,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "city": self.city,
            "promo_year": self.promo_year,
            "scolaryear": self.scolaryear,
            "scolaryear_id": self.scolaryear_id,
            "credits": self.credits,
            "gpa": self.gpa,
            "last_update": self.last_update,
            "scraper_token": self.scraper_token,
            "microsoft_session": self.microsoft_session,
            "public_scraper_id": self.public_scraper_id,
            "is_consent_share": self.is_consent_share
        }

    @property
    def id(self):
        return str(self._id)

    def __init__(self, mongo_data=None):
        if mongo_data is None:
            return
        self._id = str(mongo_data["_id"])
        self.login = mongo_data["login"]
        self.password_hash = mongo_data.get("password_hash", None)
        self.first_name = mongo_data.get("first_name", None)
        self.last_name = mongo_data.get("last_name", None)
        self.city = mongo_data.get("city", "Epitech")
        self.promo_year = mongo_data.get("promo_year", None)
        self.scolaryear = mongo_data.get("scolaryear", None)
        self.scolaryear_id = mongo_data.get("scolaryear_id", None)
        self.credits = mongo_data.get("credits", None)
        self.gpa = mongo_data.get("gpa", None)
        self.scraper_token = mongo_data.get("scraper_token", None)
        self.last_update = mongo_data.get("last_update", None)
        self.microsoft_session = mongo_data.get("microsoft_session", None)
        self.public_scraper_id = mongo_data.get("public_scraper_id", None)
        self.is_consent_share = mongo_data.get("is_consent_share", False)

    def get_scraper(self):
        from app.services.publicscraper_service import PublicScraperService
        return PublicScraperService.get_scraper(
            self.public_scraper_id) if self.public_scraper_id else None

    @property
    def required_credits(self):
        if self.scolaryear_id is None:
            return None
        credits_per_year = 60
        return credits_per_year * self.scolaryear_id
