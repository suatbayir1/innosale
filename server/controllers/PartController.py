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
            confirm, message = self.base.request_validation(request.json, required_keys.part["add"])

            if not confirm:
                return self.base.response(message = message)

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
                hazirlama_tarihi = request.json["hazirlama_tarihi"],
            )

            result = self.part_model.add(part)

            return self.base.response(message = str(result[0])), result[1]
        except:
            return self.base.response(message = "Error"), 500
        finally:
            pass