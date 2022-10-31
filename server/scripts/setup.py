# Libraries
import sys
import os
import pandas as pd
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
        self.DATABASE_NAME = "innosale_copy"
        self.mysql = MySQL(self.DATABASE_HOST, self.DATABASE_USER, self.DATABASE_PASSWORD, self.DATABASE_NAME)
    
    def create_tables(self):
        print("Creating Tables: ")
        for table in constants.tables:
            result = self.mysql.execute(table["sql"])
            print(f'Create table {table["name"]} : {result}')

    def read_excel_and_write_to_db(self):
        xlsx = pd.ExcelFile('ParcaListesi.xlsx')
        df = pd.read_excel(xlsx)
        print(df.head())

if __name__ == "__main__":
    setup = Setup()
    # setup.create_tables()
    setup.read_excel_and_write_to_db()