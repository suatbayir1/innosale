# Libraries
import sys
import os
import pandas as pd
import requests
import json
sys.path.insert(1, '/home/suat/Desktop/backup/innosale/server')
from dotenv import load_dotenv

# Core
from core.database.MySQL import MySQL

# Constants
from scripts import constants

# Configuration
load_dotenv()

class Setup():
    def __init__(self):
        self.DATABASE_HOST = os.environ.get('DATABASE_HOST')
        self.DATABASE_USER = os.environ.get('DATABASE_USER')
        self.DATABASE_PASSWORD = os.environ.get('DATABASE_PASSWORD')
        self.DATABASE_NAME = os.environ.get('DATABASE_NAME')
        self.mysql = MySQL(self.DATABASE_HOST, self.DATABASE_USER, self.DATABASE_PASSWORD, self.DATABASE_NAME)
    
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

            response = requests.post(f"{os.environ.get('BACKEND_URL')}/part/add", json = payload)
    
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

if __name__ == "__main__":
    setup = Setup()
    setup.create_tables()
    setup.read_excel_and_write_to_db()