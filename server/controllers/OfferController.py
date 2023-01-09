# Libraries
from flask_classful import FlaskView, route
from flask import request

# Middlewares
from middlewares.Base import Base

# Entities
from entities.Offer import Offer

# Models
from models.OfferModel import OfferModel

# Config
from config import required_keys

class OfferController(FlaskView, Base):
    def __init__(self):
        self.base = Base()
        self.offer_model = OfferModel()
    
    @route("/add", methods = ["POST"])
    def add(self):
        try:
            confirm, message = self.base.request_validation(request.json, required_keys.offer["add"])

            if not confirm:
                return self.base.response(message = message), 400

            offer = Offer(
                company_name = request.json["companyName"],
                date = request.json["date"],
                description = request.json["description"],
            )

            result = self.offer_model.add(offer)

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass

    @route("/update", methods = ["POST", "PUT"])
    def update(self):
        try:
            print(request.json)
            confirm, message = self.base.request_validation(request.json, required_keys.offer["update"])

            if not confirm:
                return self.base.response(message = message)

            result = self.offer_model.update(request.json)

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

            result = self.offer_model.get_all(skip, limit)
            return self.base.response(data = result[0], total_count = result[1], message = "get all"), 200
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass