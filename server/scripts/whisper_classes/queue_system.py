import time
import wave
import contextlib
import pandas as pd
from hashlib import sha256
from models.WhisperModel import WhisperModel

class QueueSystem:
    
    def __init__(self):
        self.queue = []
        self.queue_path = 'static/whisper_temp/queue.csv'
        self.whisper_model = WhisperModel()

    def __load_queue(self): # CSV dosyasından kuyruk bilgilerini okur.
        try:
            df = pd.read_csv(self.queue_path)
            self.queue = [row.to_dict() for index, row in df.iterrows()]
            return self.queue
        except:
            return []

    def __save_queue(self): # Kuyruk bilgilerini CSV dosyasına kaydeder.
        df = pd.DataFrame()
        for process in self.queue:
            append = pd.DataFrame(process, index=[0])
            df = pd.concat([df, append], ignore_index=True)
        
        df.to_csv(self.queue_path, index=False)
    
    def __id_generator(self, data): # Kuyruğa eklenecek her bir process için unique id tanımlar
        timestamp = str(time.time())
        hash = data['hash']
        sha = sha256(str(timestamp + hash).encode('utf-8'))
        return sha.hexdigest()

    def __filter_database(self, data): # Database üzerinden istenilen modelin ses ve transcribe sürelerini alır.
        model_name = data['model_name']
        df = self.whisper_model.select_as_dataframe(
            'transcribe_results', ['sound_len', f'{model_name}_time'], None
        )
        df = df.query(f'sound_len != 0 & {model_name}_time != 0')     
        return df['sound_len'].values.tolist(), df[f'{model_name}_time'].values.tolist() 
    
    def __duration(self, data): # Konumu verilen ses dosyasının uzunluğunu ölçer.
        path = data['file_path']
        
        with contextlib.closing(wave.open(path, 'r')) as f:
            frames = f.getnframes()
            rate = f.getframerate()
            duration = frames / float(rate)
            return int(round(duration, 0))
    
    def __estimated_time(self, data): # İstenilen processin tahmini transcribe süresini hesaplar.
        try:
            duration = self.__duration(data)
            db_sound_len, db_model_time = self.__filter_database(data)
            print(db_sound_len)
            print(db_model_time)
            estimated_time = (duration * sum(db_model_time)) / sum(db_sound_len)
            return int(round(estimated_time, 0))
        except:
            return -1
    
    def line_and_time(self, id): # ID verilen processin sırasını ve bekleme süresini hesaplar.
        index, total = 0, 0

        for i, process in enumerate(self.queue):
            if process['id'] == id:
                index = i
                break
            else:
                total += process['estimated_time']
        
        return index, total

    def pop(self): # Kuyruktan veri çıkartır.
        try:
            pop = self.queue.pop(0)
        except:
            return None
        finally:
            self.__save_queue()
            return pop
    
    def push(self, data): # Kuyruğa veri ekler.
        id = self.__id_generator(data)
        self.queue.append({
            'id': id,
            'hash': data['hash'],
            'file_path': data['file_path'],
            'model_name': data['model_name'],
            'duration': self.__duration(data),
            'estimated_time': self.__estimated_time(data)
        })
        self.__save_queue()
        return id