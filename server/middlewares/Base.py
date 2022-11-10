# Libraries
from flask import jsonify
from functools import wraps
import os

# Core
from core.database.MySQL import MySQL

class Base():
    def __init__(self):
        self.mysql = MySQL(
            os.environ.get('DATABASE_HOST'), 
            os.environ.get('DATABASE_USER'), 
            os.environ.get('DATABASE_PASSWORD'), 
            os.environ.get('DATABASE_NAME')
            )
        self.table_name = "parts"

    def response(self, data = [], message = "Default Message", total_count = 0):
        return jsonify(
            data = data,
            message = message,
            total_count = total_count
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