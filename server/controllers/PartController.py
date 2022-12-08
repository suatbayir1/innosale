# Libraries
from flask_classful import FlaskView, route
from flask import request

# Middlewares
from middlewares.Base import Base

# Entities
from entities.Part import Part

# Models
from models.PartModel import PartModel

# Config
from config import required_keys

class PartController(FlaskView, Base):
    def __init__(self):
        self.base = Base()
        self.part_model = PartModel()
    
    @route("/add", methods = ["POST"])
    def add(self):
        try:
            print(request.json)
            confirm, message = self.base.request_validation(request.json, required_keys.part["add"])

            if not confirm:
                return self.base.response(message = message), 400

            part = Part(
                teklif_no = request.json["teklif_no"], 
                teklif_talep_rev_no = request.json["teklif_talep_rev_no"],
                teklif_id = request.json["teklif_id"],
                sac_kalinlik = request.json["sac_kalinlik"],
                sac_cinsi = request.json["sac_cinsi"],
                net_x = request.json["net_x"],
                net_y = request.json["net_y"],
                kontur_boyu = request.json["kontur_boyu"],
                acinim_yuzey_alani = request.json["acinim_yuzey_alani"],
                sac_ts_max = request.json["sac_ts_max"],
                sac_uzama = request.json["sac_uzama"],
                sertlik = request.json["sertlik"],
                hazirlama_tarihi = request.json["hazirlanma_tarihi"],
            )

            result = self.part_model.add(part)

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass
    
    @route("/update", methods = ["POST", "PUT"])
    def update(self):
        try:
            confirm, message = self.base.request_validation(request.json, required_keys.part["update"])

            if not confirm:
                return self.base.response(message = message)

            result = self.part_model.update(request.json)

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass

    @route("/getAll", methods = ["GET"])
    def get_all(self):
        try:
            skip = request.args.get('skip') if request.args.get('skip') else 0
            limit = request.args.get('limit') if request.args.get('limit') else 10

            result = self.part_model.get_all(skip, limit)
            return self.base.response(data = result[0], total_count = result[1], message = "get all"), 200
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass

    @route("/delete/<id>", methods = ["DELETE"])
    def delete(self, id):
        try:
            print(id)
            part = self.part_model.get_part_by_id(id)
            print(part)
            if part[1] != 200:
                return self.base.response(message = "No record found for the that id"), 404

            result = self.part_model.delete_part(id)

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
