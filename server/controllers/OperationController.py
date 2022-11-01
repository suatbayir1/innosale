# Libraries
from flask_classful import FlaskView, route
from flask import request

# Middlewares
from middlewares.Base import Base

# Entities
from entities.Operation import Operation

# Models
from models.OperationModel import OperationModel

# Config
from config import required_keys

class OperationController(FlaskView, Base):
    def __init__(self):
        self.base = Base()
        self.operation_model = OperationModel()

    @route("/add", methods = ["POST"])
    def add(self):
        try:
            confirm, message = self.base.request_validation(request.json, required_keys.operation["add"])

            if not confirm:
                return self.base.response(message = message)

            print("1")

            operation = Operation(
                parca_no = request.json["parca_no"], 
                teklif_no = request.json["teklif_no"], 
                teklif_id = request.json["teklif_id"], 
                teklif_talep_rev_no = request.json["teklif_talep_rev_no"], 
                teklif_parca_rev_no = request.json["teklif_parca_rev_no"], 
                operasyon_no = request.json["operasyon_no"], 
                operasyon_adi = request.json["operasyon_adi"], 
                rl = request.json["rl"], 
                presler = request.json["presler"], 
                kalip_boyut_x = request.json["kalip_boyut_x"], 
                kalip_boyut_y = request.json["kalip_boyut_y"], 
                kalip_boyut_z = request.json["kalip_boyut_z"], 
                kalip_agirlik = request.json["kalip_agirlik"], 
                euro_kg = request.json["euro_kg"], 
                doluluk = request.json["doluluk"], 
                malzeme_mly = request.json["malzeme_mly"], 
                standart_mly = request.json["standart_mly"], 
                kaplama_mly = request.json["kaplama_mly"], 
                isil_islem_mly = request.json["isil_islem_mly"], 
                isil_islem_tip = request.json["isil_islem_tip"], 
                model_mly = request.json["model_mly"], 
                CAD = request.json["CAD"], 
                CAM = request.json["CAM"], 
                TwoD = request.json["TwoD"], 
                BCNC = request.json["BCNC"], 
                KCNC = request.json["KCNC"], 
                GCNC = request.json["GCNC"], 
                MONTAJ = request.json["MONTAJ"], 
                DNM = request.json["DNM"], 
                OLCUM = request.json["OLCUM"],
                iscilik_mly = request.json["iscilik_mly"],
                iscilik_saat = request.json["iscilik_saat"],
                toplam_mly = request.json["toplam_mly"],
            )

            result = self.operation_model.add(operation)
            print(result)

            return self.base.response(message = str(result[0])), result[1]
        except:
            return self.base.response(message = "Error"), 500
        finally:
            pass