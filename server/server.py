# Libraries
from flask import Flask, jsonify
from flask_classful import FlaskView, route
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Middlewares
from middlewares.Base import Base

# Controllers
from controllers.PartController import PartController

# Configuration
load_dotenv()

class Api(FlaskView, Base):
    def __init__(self):
        self.base = Base()

    @route("/test", methods = ["GET"])
    def test(self):
        print(os.environ.get('TEST'))
        result = self.base.response(message = "Server is running")
        return result

if __name__ == "__main__":
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = 'static/models'
    CORS(app, supports_credentials = True)
    Api.register(app, route_base = '/api/v1')
    PartController.register(app, route_base = '/api/v1/part')
    app.run(debug = True, port = 5000)