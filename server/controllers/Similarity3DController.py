# Libraries
from flask_classful import FlaskView, route
from flask import request
from helpers.create_excell_file import generate_table


class Similarity3DController(FlaskView):
    def __init__(self):
        pass

    @route("/test", methods = ["GET"])
    def test(self):
        return {"test": "test"}

    @route("/test2", methods = ["GET"])
    def test2(self):
        return {"test2": "test2"}

    @route("/get/<id>/<amount>", methods = ["GET"])
    def get(self, id, amount):
        return {"test1": "test1"}
        return generate_table(id,amount)
        print(id)
