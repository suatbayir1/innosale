# Entities
import os

# Middlewares
from middlewares.Base import Base

# Core
from core.database.MySQL import MySQL

class FileModel(Base):
    def __init__(self):
        self.base = Base()

    def uploadAudio(self, payload):
        try: 
            print("payload", payload)
            result = self.base.mysql.insert(
                table_name = "audios",
                columns = """
                    filename, path, model, teklifId
                """,
                column_types = "%s, %s, %s, %s",
                val = ([payload["filename"], payload["path"], payload["model"], payload["teklifId"]]) 
            )

            return result
        except Exception as e:
            return [e, 500]

    def get_all_audios(self, skip: int, limit: int):
        try:
            return self.base.mysql.select_all_skip_limit(
                table_name = "audios", 
                skip = skip,
                limit = limit
            )
            
        except Exception as e:
            return [e, 500]

    def get_audios_by_offer_id(self, value):
        try:
            return self.base.mysql.select_by_key_value(
                table_name = "audios", 
                key = "teklifId",
                value = [int(value)]
            )
            
        except Exception as e:
            return [e, 500]


    def get_audio_by_id(self, id):
        try:
            return self.base.mysql.select_by_id(
                table_name = "audios", 
                id = [id]
            )
            
        except Exception as e:
            return [e, 500]

    def delete_audio_file(self, id):
        try:
            return self.base.mysql.delete(
                table_name = "audios", 
                where = "id",
                val = ([id])
            )
        except Exception as e:
            return [e, 500]

    def update_audio(self, params):
        try:
            columns = ""
            val = []
            where = ""
            for key, value in params["attributes"].items():
                columns += f"{key} = %s, "
                val.append(value)

            for key, value in params["where"].items():
                where = key
                val.append(value)

            result = self.base.mysql.update(
                table_name = "audios",
                columns = columns[:-2],
                where = where,
                val = val
            )

            return result
        except Exception as e:
            return [e, 500]