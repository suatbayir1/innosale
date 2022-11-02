# Libraries
import mysql.connector

class MySQL():
    def __init__(self, host, user, password, database):
        self.db = mysql.connector.connect(
            host = host,
            user = user,
            password = password,
            database = database
        )
        self.cursor = self.db.cursor()

    def create_database(self, database_name):
        try:
            self.cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
            return True
        except:
            return False

    def execute(self, sql):
        try:
            self.cursor.execute(sql)
            return True
        except:
            return False
    
    def insert(self, table_name, columns, column_types, val):
        try:
            sql = f"INSERT INTO {table_name} ({columns}) VALUES ({column_types})"
            self.cursor.execute(sql, val)
            self.db.commit()

            return ["Record successfully added", 200] if self.cursor.rowcount > 0 else ["An error occurred while inserting a new record", 500]
        except Exception as e:
            return [e, 500]
    
    def update(self, table_name, columns, where, val):
        try:
            sql = f"UPDATE {table_name} SET {columns} WHERE {where} = %s"
            self.cursor.execute(sql, val)
            self.db.commit()
            return ["Record successfully updated", 200]
        except Exception as e:
            return [e, 500]