import json
import os.path

from app.globals import Globals
from app.models.PublicScraper import PublicScraper
from app.services.student_service import StudentService
from app.tools.teklogger import log_warning


def get_config():
    config_file_path = os.path.join(os.getenv("DATA_PATH"), "scrapers.json")
    if not os.path.exists(config_file_path):
        with open(config_file_path, "w") as f:
            f.write("[]")
    if not os.access(config_file_path, os.R_OK):
        raise Exception(f"{config_file_path} is not readable")
    if not os.access(config_file_path, os.W_OK):
        raise Exception(f"{config_file_path} is not writable")
    with open(config_file_path, "r") as f:
        return json.load(f)


class PublicScraperService:

    @staticmethod
    def load_scrapers_from_config():
        scrapers = Globals.public_scrapers
        config = get_config()
        for scraper in config:
            for key in ["id", "label", "access_token"]:
                if not scraper.get(key):
                    raise Exception(
                        f"Missing key {key} in scraper configuration")

            is_new = PublicScraperService.get_scraper(scraper["id"]) is None
            ns = PublicScraper() if is_new else PublicScraperService.get_scraper(
                scraper["id"])
            ns.id = scraper["id"]
            ns.name = scraper["label"]
            ns.access_token = scraper["access_token"]

            if is_new:
                Globals.public_scrapers.append(ns)

    @staticmethod
    def get_scraper(scraper_id: str) -> PublicScraper:
        result = [scraper for scraper in Globals.public_scrapers if
                  scraper.id == scraper_id]
        return result[0] if result else None

    @staticmethod
    def get_scraper_by_accesstoken(access_token: str) -> PublicScraper:
        scrapers = Globals.public_scrapers
        result = [scraper for scraper in scrapers if
                  scraper.access_token == access_token]
        return result[0] if result else None

    @staticmethod
    def get_all_scrapers() -> [PublicScraper]:
        return Globals.public_scrapers

    @staticmethod
    def reassign_scrapers():
        changed = False
        students = StudentService.get_public_scraper_students()
        scrapers = PublicScraperService.get_all_scrapers()
        if len(scrapers) == 0:
            return
        max_per_scraper = len(students) // len(scrapers) + 1

        def count_of(scraper_id: str):
            return len([student for student in students if
                        student.public_scraper_id == scraper_id])

        def need_reassign():
            return any([count_of(scraper.id) > max_per_scraper for scraper in
                        scrapers])

        def find_smallest():
            return min(scrapers, key=lambda s: count_of(s.id))

        def find_biggest():
            return max(scrapers, key=lambda s: count_of(s.id))

        for student in students:
            if not student.public_scraper_id or not PublicScraperService.get_scraper(
                    student.public_scraper_id):
                changed = True
                student.public_scraper_id = find_smallest().id
        while need_reassign():
            smallest = find_smallest()
            biggest = find_biggest()
            student = next((student for student in students if
                            student.public_scraper_id == biggest.id), None)
            student.public_scraper_id = smallest.id
            changed = True

        if changed:
            # Save students
            for student in students:
                StudentService.update_student(student)
