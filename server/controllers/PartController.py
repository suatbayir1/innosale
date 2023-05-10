# Libraries
from flask_classful import FlaskView, route
from flask import request
from werkzeug.utils import secure_filename
import os

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
            target = os.path.join(f"{os.environ.get('PROJECT_BASE_URL')}/server/static", 'igs')
            if not os.path.isdir(target):
                os.mkdir(target)

            current_file = request.files['file']
            filename = secure_filename(current_file.filename)

            if filename in os.listdir(target):
                return self.base.response(message = "Filename already exists"), 409

            destination = "/".join([target, filename])
            current_file.save(destination)

            part = Part(
                teklif_no = request.form["teklif_no"], 
                teklif_talep_rev_no = int(request.form["teklif_talep_rev_no"]),
                teklif_id = int(request.form["teklif_id"]),
                sac_kalinlik = float(request.form["sac_kalinlik"]),
                sac_cinsi = request.form["sac_cinsi"],
                net_x = int(request.form["net_x"]),
                net_y = int(request.form["net_y"]),
                kontur_boyu = int(request.form["kontur_boyu"]),
                acinim_yuzey_alani = int(request.form["acinim_yuzey_alani"]),
                sac_ts_max = int(request.form["sac_ts_max"]),
                sac_uzama = int(request.form["sac_uzama"]),
                sertlik = request.form["sertlik"],
                hazirlama_tarihi = request.form["hazirlama_tarihi"],
                model_path = destination
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
            print(request.form)
            print(request.files)
            confirm, message = self.base.request_validation(request.json, required_keys.part["update"])

            if not confirm:
                return self.base.response(message = message)

            result = self.part_model.update(request.json)

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass

    @route("/updateModelFile", methods = ["POST", "PUT"])
    def updateModelFile(self):
        try:
            print(request.form)
            print(request.files)

            part = self.part_model.get_part_by_id(request.form["id"])
            print(part)

            if part[1] != 200:
                return self.base.response(message = "No record found for the that id"), 404

            if os.path.isfile(part[0]["model_path"]):
                os.remove(part[0]["model_path"])

            target = os.path.join(f"{os.environ.get('PROJECT_BASE_URL')}/server/static", 'igs')
            if not os.path.isdir(target):
                os.mkdir(target)

            current_file = request.files['file']
            filename = secure_filename(current_file.filename)
            destination = "/".join([target, filename])
            current_file.save(destination)

            print(destination)
            result = self.part_model.update({ 
                "attributes": {"model_path": destination}, 
                "where": { "id": request.form["id"] } 
            })

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500

    @route("/getAll", methods = ["GET"])
    def getAll(self):
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
            part = self.part_model.get_part_by_id(id)

            if part[1] != 200:
                return self.base.response(message = "No record found for the that id"), 404

            result = self.part_model.delete_part(id)

            if result[1] == 200:
                if os.path.isfile(part[0]["model_path"]):
                    os.remove(part[0]["model_path"])

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500

    @route("/getPartsByOfferId/<offer_id>", methods = ["GET"])
    def get_parts_by_offer_id(self, offer_id):
        try:
            result = self.part_model.get_parts_by_key_value("teklif_id", offer_id)
            print(result)
            if not result[0]:
                print("test")
                return self.base.response(data = result[0], total_count = len(result[0]), message = "No part records found related with this offer"), result[1]

            return self.base.response(data = result[0], total_count = len(result[0]), message = "Parts successfully fetched by offer id"), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass