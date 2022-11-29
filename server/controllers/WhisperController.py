import scripts.whisper_classes.ignore_warnings
from scripts.whisper_classes.queue_system import QueueSystem
from scripts.whisper_classes.whisper_transcriber import WhisperTranscriber
from werkzeug.utils import secure_filename

import os
import json
import wave
import hashlib
import contextlib
from time import sleep
from flask import request
from middlewares.Base import Base
from flask_classful import FlaskView, route
from pytorch_lightning import seed_everything
from models.WhisperModel import WhisperModel

# Config
from config import required_keys 

# Entities
from entities.TranscribeResults import TranscribeResults

class WhisperController(FlaskView, Base):
    def __init__(self):
        self.base = Base()
        self.whisper_model = WhisperModel()
        self.queue_system = QueueSystem()
        self.config_path = 'static/whisper_temp/queue.json'

        self.transcriber_tiny, self.config_tiny = self.__model_init('tiny')
        #self.transcriber_base, self.config_base = self.__model_init('base')
        #self.transcriber_small, self.config_small = self.__model_init('small')
        #self.transcriber_medium, self.config_medium = self.__model_init('medium')
        #self.transcriber_large, self.config_large = self.__model_init('large')
    
    def __model_init(self, model_name):
        if model_name == 'tiny': model_version = '2022-11-15_16-36-42'
        elif model_name == 'base': model_version = ''
        elif model_name == 'small': model_version = ''
        elif model_name == 'medium': model_version = ''
        elif model_name == 'large': model_version = ''

        model_path = f'static/whisper_model/artifacts/{model_name}/{model_version}'

        with open(f'{model_path}/config.json') as json_file:
            config = json.load(json_file)
            seed_everything(config['seed'], workers=True)

            whisper_transcriber = WhisperTranscriber(config, model_path)
            return whisper_transcriber, config

    def __sha256(self, file):
        with open(file, 'rb') as f:
            bytes = f.read()
            return hashlib.sha256(bytes).hexdigest()
    
    def __waw_len_as_sec(self, path):
        with contextlib.closing(wave.open(path, 'r')) as f:
            frames = f.getnframes()
            rate = f.getframerate()
            duration = frames / float(rate)
            return int(round(duration, 0))

    def __name_creator(self, name, index):
        if index < 10: return f'{name}_00{index}.wav'
        elif 10 <= index and index < 100: return f'{name}_0{index}.wav'
        elif index <= 100: return f'{name}_{index}.wav'

    def __renamer(self, path, file):
        old_file_path = os.path.join(path, file)

        i = 1
        while True:
            new_file = self.__name_creator('meeting', i)

            if new_file in os.listdir(path):
                i += 1
            else:
                new_file_path = os.path.join(path, new_file)
                os.rename(old_file_path, new_file_path)
                return path, new_file
    
    def __get_db_as_df(self, table_name, column_list=[' * '], hash=None):
        return self.whisper_model.select_as_dataframe(table_name, column_list, hash)
    
    def __insert_new_line(self, values): 
        try:
            transcribe_results = TranscribeResults(
                hash = values['hash'], 
                sound_len = values['sound_len'],
                tiny_time = values['tiny_time'],
                tiny_result = values['tiny_result'],
                base_time = values['base_time'],
                base_result = values['base_result'],
                small_time = values['small_time'],
                small_result = values['small_result'],
                medium_time = values['medium_time'],
                medium_result = values['medium_result'],
                large_time = values['large_time'],
                large_result = values['large_result']
            )
            result = self.whisper_model.insert(transcribe_results)
            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass
    
    def __update_line(self, model_name, values, hash):
        return self.whisper_model.update(model_name, values, hash)
    
    @route("/add", methods = ["POST"])
    def add(self):
        try:
            confirm, message = self.base.request_validation(request.json, required_keys.transcribe_results["add"])

            if not confirm:
                return self.base.response(message = message)

            transcribe_results = TranscribeResults(
                hash = request.json["hash"], 
                sound_len = request.json["sound_len"],
                tiny_time = request.json["tiny_time"],
                tiny_result = request.json["tiny_result"],
                base_time = request.json["base_time"],
                base_result = request.json["base_result"],
                small_time = request.json["small_time"],
                small_result = request.json["small_result"],
                medium_time = request.json["medium_time"],
                medium_result = request.json["medium_result"],
                large_time = request.json["large_time"],
                large_result = request.json["large_result"]
            )

            result = self.whisper_model.add(transcribe_results)

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500
        finally:
            pass

    @route("/test", methods = ['POST'])
    def test(self):
        # POST Data
        file = request.json["file"]
        path = request.json["path"]
        model_name = request.json["model_name"]

        file_path = os.path.join(path, file)
        id = self.queue_system.push({
            'hash': self.__sha256(file_path),
            'file_path': file_path,
            'model_name': model_name
        })
        print(self.queue_system.line_and_time(id))
        
        return self.base.response({'file':file, 'path':path, 'model_name':model_name}, "Transcribing...")

    @route("/queue_info", methods = ['POST'])
    def queue_info(self):
        id = request.json["id"]
        line, time = self.queue_system.line_and_time(id)
        return self.base.response({ 'line': line, 'time': time }, "Remaining Time")

    @route("/getAllAudios", methods = ["GET"])
    def get_all(self):
        try:
            skip = request.args.get('skip') if request.args.get('skip') else 0
            limit = request.args.get('limit') if request.args.get('limit') else 10

            result = self.whisper_model.get_all_audios(skip, limit)
            print(result)
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

            result = self.whisper_model.uploadAudio({
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
            audio = self.whisper_model.get_audio_by_id(id)
            if audio[1] != 200:
                return self.base.response(message = "No record found for the that id"), 404

            result = self.whisper_model.delete_audio_file(id)

            if result[1] == 200:
                if os.path.isfile(audio[0]["path"]):
                    os.remove(audio[0]["path"])

            return self.base.response(message = str(result[0])), result[1]
        except Exception as e:
            return self.base.response(message = e), 500

    @route("/transcribe", methods = ['POST'])
    def transcribe(self):
        # POST Data
        file = request.json["file"]
        path = request.json["path"]
        model_name = request.json["model_name"]
        
        # Renaming & Encr. File
        path, file = self.__renamer(path, file)
        file_path = os.path.join(path, file)
        file_sha = self.__sha256(file_path)

        # MySQL DB Controller
        hash_df = self.__get_db_as_df('transcribe_results')
        hash_list = hash_df['hash'].to_list()

        if file_sha in hash_list:
            query_df = hash_df[hash_df['hash'] == file_sha]
            print(query_df)
            if not query_df.iloc[0][f'{model_name}_result'] == '0.0':
                time__ = query_df.iloc[0][f'{model_name}_time']
                result__ = query_df.iloc[0][f'{model_name}_result']
                return self.base.response({ "elapsed_time": str(time__), "result": result__ }, "Cached Result")
            else:
                pass
        else:
            print(file_sha)
            self.__insert_new_line({
                "hash": file_sha,
                "sound_len": self.__waw_len_as_sec(file_path),
                "tiny_time": 0,
                "tiny_result": '0.0',
                "base_time": 0,
                "base_result": '0.0',
                "small_time": 0,
                "small_result": '0.0',
                "medium_time": 0,
                "medium_result": '0.0',
                "large_time": 0,
                "large_result": '0.0'
            })
        
        id = self.queue_system.push({
            'hash': self.__sha256(file_path),
            'file_path': file_path,
            'model_name': model_name
        })

        while True:
            line, time = self.queue_system.line_and_time(id)
            if line == 0 and time == 0: break
            else: sleep(10)
        
        if model_name == 'tiny':
            result, time = self.transcriber_tiny.transcribe_sound(path, file, f'{path}/{str(file).split(".")[0]}/')
        elif model_name == 'base':
            result, time = self.transcriber_base.transcribe_sound(path, file, f'{path}/{str(file).split(".")[0]}/')
        elif model_name == 'small':
            result, time = self.transcriber_small.transcribe_sound(path, file, f'{path}/{str(file).split(".")[0]}/')
        elif model_name == 'medium':
            result, time = self.transcriber_medium.transcribe_sound(path, file, f'{path}/{str(file).split(".")[0]}/')
        elif model_name == 'large':
            result, time = self.transcriber_large.transcribe_sound(path, file, f'{path}/{str(file).split(".")[0]}/')
        else:
            return self.base.response([], message='Wrong model name!')
        
        result = str(result).replace('<|transcribe|>', ' ').replace('<|notimestamps|>', ' ').replace('\n', ' ')
        data = {
            'elapsed_time': str(int(round(time, 0))),
            'result': str(result)
        }

        result = self.__update_line(
            model_name,
            [data['elapsed_time'], data['result'].replace('\'', '\\\'')],
            file_sha
        )

        print(result)
        self.queue_system.pop()
        return self.base.response(data, "Transcribing...")