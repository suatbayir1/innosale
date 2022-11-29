# Libraries
from flask_classful import FlaskView, route
from flask import request
from werkzeug.utils import secure_filename
import os

# Middlewares
from middlewares.Base import Base

# Models
from models.FileModel import FileModel

# Config
from config import required_keys 

class FileController(FlaskView, Base):
    def __init__(self):
        self.base = Base()
        self.file_model = FileModel()

    @route("/getAllAudios", methods = ["GET"])
    def get_all(self):
        try:
            skip = request.args.get('skip') if request.args.get('skip') else 0
            limit = request.args.get('limit') if request.args.get('limit') else 10
            result = self.file_model.get_all_audios(skip, limit)
            return self.base.response(data = result[0], total_count = result[1], message = "Audios fetched successfully"), 200
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass

    @route("/uploadAudio", methods = ["POST"])
    def uploadAudio(self):
        try:
            target = os.path.join(f"{os.environ.get('PROJECT_BASE_URL')}/server/static", 'audios')
            if not os.path.isdir(target):
                os.mkdir(target)

            current_file = request.files['file']
            filename = secure_filename(current_file.filename)

            if filename in os.listdir(target):
                return self.base.response(message = "Filename already exists"), 409

            destination = "/".join([target, filename])
            current_file.save(destination)

            result = self.file_model.uploadAudio({
                "filename": filename,
                "path": destination,
                "model": request.form["model"]
            })

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500

    @route("/deleteAudio/<id>", methods = ["DELETE"])
    def deleteAudio(self, id):
        try:
            audio = self.file_model.get_audio_by_id(id)
            if audio[1] != 200:
                return self.base.response(message = "No record found for the that id"), 404

            result = self.file_model.delete_audio_file(id)

            if result[1] == 200:
                if os.path.isfile(audio[0]["path"]):
                    os.remove(audio[0]["path"])

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500

    @route("/updateAudio", methods = ["POST", "PUT"])
    def updateAudio(self):
        try:
            confirm, message = self.base.request_validation(request.json, required_keys.nlp["update"])

            if not confirm:
                return self.base.response(message = message)

            result = self.file_model.update_audio(request.json)

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass
