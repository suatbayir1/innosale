# Middlewares
from middlewares.Base import Base

class WhisperModel(Base):
    def __init__(self):
        self.base = Base()
        self.table_name = "transcribe_results"

    def select_as_dataframe(self, table_name, column_list, hash):
        return self.base.mysql.select_as_dataframe(table_name, column_list, hash)

    def insert(self, transcribe_result):
        try:
            result = self.base.mysql.insert(
                table_name = self.table_name,
                columns = """
                    hash, sound_len, tiny_time, tiny_result,
                    base_time, base_result, small_time, small_result,
                    medium_time, medium_result, large_time, large_result
                """,
                column_types = "%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s",
                val = ([
                    transcribe_result.hash, transcribe_result.sound_len,
                    transcribe_result.tiny_time, transcribe_result.tiny_result,
                    transcribe_result.base_time, transcribe_result.base_result,
                    transcribe_result.small_time, transcribe_result.small_result,
                    transcribe_result.medium_time, transcribe_result.medium_result,
                    transcribe_result.large_time, transcribe_result.large_result
                ]) 
            )
            return result
        except Exception as e:
            return [e, 500]

    def uploadAudio(self, payload):
        try: 
            result = self.base.mysql.insert(
                table_name = "audios",
                columns = """
                    filename, path, model
                """,
                column_types = "%s, %s, %s",
                val = ([payload["filename"], payload["path"], payload["model"]]) 
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

    def delete_audio_file(self, id):
        try:
            return self.base.mysql.delete(
                table_name = "audios", 
                where = "id",
                val = ([id])
            )
        except Exception as e:
            return [e, 500]


    def update(self, model_name, values, hash):
        try:
            columns = f"{model_name}_time = {values[0]}, {model_name}_result = '{values[1]}'"

            result = self.base.mysql.update(
                table_name = self.table_name,
                columns = columns,
                where = 'hash',
                val = [hash]
            )

            return result
        except Exception as e:
            return [e, 500]

    def add(self, transcribe_result):
        try: 
            print("model", transcribe_result.hash)
            result = self.base.mysql.insert(
                table_name = self.table_name,
                columns = """
                    hash, sound_len, tiny_time, tiny_result,
                    base_time, base_result, small_time, small_result,
                    medium_time, medium_result, large_time, large_result
                """,
                column_types = "%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s",
                val = ([
                    transcribe_result.hash, transcribe_result.sound_len,
                    transcribe_result.tiny_time, transcribe_result.tiny_result,
                    transcribe_result.base_time, transcribe_result.base_result,
                    transcribe_result.small_time, transcribe_result.small_result,
                    transcribe_result.medium_time, transcribe_result.medium_result,
                    transcribe_result.large_time, transcribe_result.large_result
                ]) 
            )
            return result
        except Exception as e:
            return [e, 500]