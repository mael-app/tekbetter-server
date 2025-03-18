from app.services.student_service import StudentService
from app.metrics import user_total, user_total_verified
from app.tools.teklogger import log_debug


def update_metrics():
    log_debug("Updating metrics")
    update_user_total()
    update_user_total_verified()


def update_user_total():
    total_users = StudentService.get_all_students_count()
    user_total.set(total_users)
    log = f"Updated user_total to {total_users}"
    log_debug(log)


def update_user_total_verified():
    total_users = StudentService.get_all_students_verified_count()
    user_total_verified.set(total_users)
    log = f"Updated user_total_verified to {total_users}"
    log_debug(log)
