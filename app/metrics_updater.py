from app.services.student_service import StudentService
from app.metrics import user_total, user_total_verified, users_per_scraper
from app.tools.teklogger import log_debug


def update_metrics():
    log_debug("Updating metrics")
    update_user_total()
    update_user_total_verified()
    update_public_scraper_repartition()


def update_user_total():
    student_counts = StudentService.get_students_count_by_campus_and_promo()
    for row in student_counts:
        campus = row["_id"].get("city")
        promo_year = str(row["_id"].get("scolaryear_id"))
        count = row["count"]

        if campus and promo_year:
            user_total.labels(campus=campus, promotion_year=promo_year).set(count)
            log_debug(f"Updated user_total for campus={campus}, year={promo_year} to {count}")

def update_public_scraper_repartition():
    students = StudentService.get_all_students()
    scrapers = {}
    for student in students:
        if student.public_scraper_id:
            scrapers[student.public_scraper_id] = scrapers.get(student.public_scraper_id, 0) + 1

    for scraper_id, count in scrapers.items():
        users_per_scraper.labels(scraper=scraper_id).set(count)
        log_debug(f"Updated users_per_scraper for scraper={scraper_id} to {count}")

def update_user_total_verified():
    verified_counts = StudentService.get_verified_students_count_by_campus_and_promo()
    for row in verified_counts:
        campus = row["_id"].get("city")
        promo_year = str(row["_id"].get("scolaryear_id"))
        count = row["count"]

        if campus != "Epitech" and campus and promo_year:
            user_total_verified.labels(campus=campus, promotion_year=promo_year).set(count)
            log_debug(f"Updated user_total_verified for campus={campus}, year={promo_year} to {count}")
