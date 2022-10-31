# Libraries
from flask import jsonify
from functools import wraps

class Base():
    def response(self, data = [], message = "Default Message"):
        return jsonify(
            data = data,
            message = message
        )

    def request_validation(self, payload, required_keys):
        confirm = True
        message = ""

        if payload == None:
            confirm = False
            message = "Body cannot be empty"
            return confirm, message

        for key in required_keys:
            if key not in payload or payload[key] == "":
                confirm = False
                message += f"{key}, "
        
        return confirm, f"Cannot be empty: {message[:-2]}"