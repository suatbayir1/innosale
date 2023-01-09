# Libraries
import sys
import os, rarfile
import pandas as pd
import requests
import json
sys.path.insert(1, '/root/innosale/server')
from dotenv import load_dotenv

# Core
from core.database.MySQL import MySQL

# Constants
from scripts import constants

# Entities
from entities.Part import Part

# Models
from models.PartModel import PartModel

# Configuration
load_dotenv()

class Setup():
    def __init__(self):
        self.DATABASE_HOST = os.environ.get('DATABASE_HOST')
        self.DATABASE_USER = os.environ.get('DATABASE_USER')
        self.DATABASE_PASSWORD = os.environ.get('DATABASE_PASSWORD')
        self.DATABASE_NAME = os.environ.get('DATABASE_NAME')
        self.mysql = MySQL(self.DATABASE_HOST, self.DATABASE_USER, self.DATABASE_PASSWORD, self.DATABASE_NAME)
        self.part_model = PartModel()

    def drop_tables(self):
        print("Dropping Tables: ")
        for table in constants.tables:
            result = self.mysql.execute(f"DROP TABLE IF EXISTS {table['name']}")
            print(f'drop table {table["name"]} : {result}')
    
    def create_tables(self):
        print("Creating Tables: ")
        for table in constants.tables:
            result = self.mysql.execute(table["sql"])
            print(f'Create table {table["name"]} : {result}')

    def read_excel_and_write_to_db(self):
        for filename in constants.excel_files:
            xlsx = pd.ExcelFile(filename)
            df = pd.read_excel(xlsx)
            
            if filename == "ParcaListesi.xlsx":
                self.insert_parts(df)
            elif filename == "Operasyonlar.xlsx":
                self.insert_operations(df)
            elif filename == "TranscribeResults.xlsx":
                self.insert_transcribe_results(df)

    def insert_parts(self, df):
        print("Part inserting...")
        df.fillna(0, inplace =  True)
        for index, row in df.iterrows():
            payload = {
                "teklif_no": row.loc['TeklifNo'],
                "teklif_talep_rev_no": row.loc['TeklifTalepRevNo'],
                "teklif_id": row.loc['TeklifId'],
                "sac_kalinlik": row.loc['SacKalinlik'],
                "sac_cinsi": row.loc['SacCinsi'],
                "net_x": row.loc['NetX'],
                "net_y": row.loc['NetY'],
                "kontur_boyu": row.loc['KonturBoyu'],
                "acinim_yuzey_alani": row.loc['AcinimYuzeyAlani'], 
                "sac_ts_max": row.loc['SacTsMax'],
                "sac_uzama": row.loc['SacUzama'], 
                "sertlik": row.loc['Sertlik'], 
                "hazirlama_tarihi": row.loc['HAZIRLAMATARIHI'].date().strftime('%Y-%m-%d')
            }

            part = Part(
                teklif_no = row.loc['TeklifNo'], 
                teklif_talep_rev_no = int(row.loc['TeklifTalepRevNo']),
                teklif_id = int(row.loc['TeklifId']),
                sac_kalinlik = float(row.loc['SacKalinlik']),
                sac_cinsi = row.loc['SacCinsi'],
                net_x = int(row.loc['NetX']),
                net_y = int(row.loc['NetY']),
                kontur_boyu = int(row.loc['KonturBoyu']),
                acinim_yuzey_alani = int(row.loc['AcinimYuzeyAlani']),
                sac_ts_max = int(row.loc['SacTsMax']),
                sac_uzama = int(row.loc['SacUzama']),
                sertlik = row.loc['Sertlik'],
                hazirlama_tarihi = row.loc['HAZIRLAMATARIHI'].date().strftime('%Y-%m-%d'),
                model_path = ""
            )

            result = self.part_model.add(part)

            # response = requests.post(f"{os.environ.get('BACKEND_URL')}/part/add", json = payload)
    
    def insert_operations(self, df):
        print("Operations Inserting...")
        df.fillna(0, inplace =  True)
        for index, row in df.iterrows():
            payload = {
                "parca_no": row.loc['ParcaNo'],
                "teklif_no": row.loc['TeklifNo'],
                "teklif_id": row.loc['TeklifId'],
                "teklif_talep_rev_no": row.loc['TeklifTalepRevNo'],
                "teklif_parca_rev_no": row.loc['TeklifParcaRevNo'],
                "operasyon_no": row.loc['OpNo'],
                "operasyon_adi": row.loc['OperasyonADI'],
                "rl": row.loc['RL'],
                "presler": row.loc['Presler'],
                "kalip_boyut_x": row.loc['KalipBoyutlariX'],
                "kalip_boyut_y": row.loc['KalipBoyutlariY'],
                "kalip_boyut_z": row.loc['KalipBoyutlariZ'],
                "kalip_agirlik": row.loc['KalipAgr'],
                "euro_kg": row.loc['EuroKg'],
                "doluluk": row.loc['Doluluk'],
                "malzeme_mly": row.loc['MalzemeMly'],
                "standart_mly": row.loc['StandartMly'],
                "kaplama_mly": row.loc['KaplamaMly'],
                "isil_islem_mly": row.loc['ISILIslemMly'],
                "isil_islem_tip": row.loc['ISILIslemTip'],
                "model_mly": row.loc['ModelMly'],
                "CAD": row.loc['CAD'],
                "CAM": row.loc['CAM'],
                "TwoD": row.loc['2D'],
                "BCNC": row.loc['BCNC'],
                "KCNC": row.loc['KCNC'],
                "GCNC": row.loc['GCNC'],
                "MONTAJ": row.loc['MONTAJ'],
                "DNM": row.loc['DNM'],
                "OLCUM": row.loc['OLCUM'],
                "iscilik_mly": row.loc['IscilikMly'],
                "iscilik_saat": row.loc['IscilikSaat'],
                "toplam_mly": row.loc['ToplamMly'],
            }

            response = requests.post(f"{os.environ.get('BACKEND_URL')}/operation/add", json = payload)
        
    def insert_transcribe_results(self, df):
        print("Transcribe Results Inserting...")
        df.fillna(0, inplace = True)
        for index, row in df.iterrows():
            payload = {
                "hash": row.loc['hash'],
                "sound_len": row.loc['sound_len'],
                "tiny_time": row.loc['tiny_time'],
                "tiny_result": row.loc['tiny_result'],
                "base_time": row.loc['base_time'],
                "base_result": row.loc['base_result'],
                "small_time": row.loc['small_time'],
                "small_result": row.loc['small_result'],
                "medium_time": row.loc['medium_time'],
                "medium_result": row.loc['medium_result'],
                "large_time": row.loc['large_time'],
                "large_result": row.loc['large_result']
            }
            response = requests.post(f"{os.environ.get('BACKEND_URL')}/whisper/add", json = payload)

    def save_part_model(self):
        print("3D Models saving")
        try:
            for rar in os.listdir(os.environ.get('SOURCE_IGS_PATH')):
                filepath = os.path.join(os.environ.get('SOURCE_IGS_PATH'), rar)
                opened_rar = rarfile.RarFile(filepath)
                for f in opened_rar.infolist():
                    extracted_file_name = f.filename
                opened_rar.extractall(os.environ.get('TARGET_IGS_PATH'))

                # save path to part
                payload = {
                    "attributes": {
                        "model_path": f"{os.environ.get('TARGET_IGS_PATH')}/{extracted_file_name}",
                    },
                    "where":{
                        "teklif_id": int(rar.split(".")[0].split("_")[3])
                    }
                }

                response = requests.post(f"{os.environ.get('BACKEND_URL')}/part/update", json = payload)
        except Exception as e: 
            print(e)


if __name__ == "__main__":
    setup = Setup()
    setup.drop_tables()
    setup.create_tables()
    setup.read_excel_and_write_to_db()
    setup.save_part_model()