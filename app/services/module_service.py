import uuid
from datetime import datetime, timedelta
from app.globals import Globals
from app.models.Module import Module

class ModuleService:

    @staticmethod
    def get_student_modules(student_id: str):
        return [Module(p) for p in
                Globals.database["modules"].find({"student_id": student_id})]

    @staticmethod
    def get_recent_fetched_modules(student_id: str):
        # get only modules who the fetch_date is higher than 10 minutes
        r = Globals.database["modules"].find({"student_id": student_id, "fetch_date": {"$gt": (datetime.now() - timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S")}})
        return [Module(p) for p in r]

    @staticmethod
    def get_module_by_code(student_id: str, code_module: str) -> Module | None:
        p = Globals.database["modules"].find_one(
            {"code_module": code_module, "student_id": student_id})
        if p:
            return Module(p)
        return None

    @staticmethod
    def get_module_by_id(student_id: str, module_id: int) -> Module | None:
        p = Globals.database["modules"].find_one({"module_id": module_id, "student_id": student_id})
        if p:
            return Module(p)
        return None

    @staticmethod
    def get_latest_fetchdate(student_id: str) -> str:
        p = Globals.database["modules"].find_one({"student_id": student_id},
                                                  sort=[("fetch_date", -1)])
        return p["fetch_date"] if p else None

    @staticmethod
    def upload_module(module: Module):
        curr = ModuleService.get_module_by_id(module.student_id, module.module_id)
        if curr:
            module._id = curr._id
            module.code_module = curr.code_module
            Globals.database["modules"].update_one({"_id": module._id}, {"$set": module.to_dict()})
        else:
            module._id = uuid.uuid4().hex
            Globals.database["modules"].insert_one(module.to_dict())
        return module

    @staticmethod
    def delete_module(module: Module):
        Globals.database["modules"].delete_one({"_id": module.mongo_id})

    @staticmethod
    def get_modules_json(student_id: str) -> {str: {str: str}}:
        all = ModuleService.get_student_modules(student_id)
        modules = {}
        for mod in all:
            if mod.code_module not in modules:
                modules[mod.code_module] = {
                    "code": mod.code_module,
                    "scolaryear": mod.scol_year,
                    "id": mod.module_id,
                    "name": mod.title,
                }
        return modules
