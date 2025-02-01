import os

class StudentPictureService:
    @staticmethod
    def get_student_picture(login: str) -> bytes or None:
        if not StudentPictureService.is_picture_exists(login):
            return None
        img_bytes = open(os.path.join(os.getenv("DATA_PATH"), "student_pictures", f"{login}.jpg"), "rb").read()
        return img_bytes

    @staticmethod
    def add_student_picture(login: str, img_bytes: bytes):
        path = os.path.join(os.getenv("DATA_PATH"), "student_pictures", f"{login}.jpg")
        with open(path, "wb") as f:
            f.write(img_bytes)

    @staticmethod
    def remove_student_picture(login: str):
        if not StudentPictureService.is_picture_exists(login):
            return False
        path = os.path.join(os.getenv("DATA_PATH"), "student_pictures", f"{login}.jpg")
        os.remove(path)
        return True

    @staticmethod
    def is_picture_exists(login: str):
        path = os.path.join(os.getenv("DATA_PATH"), "student_pictures", f"{login}.jpg")
        return os.path.exists(path)
