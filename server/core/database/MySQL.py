# Libraries
import mysql.connector
import pandas as pd

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
    
    def select_all_skip_limit(self, table_name, skip, limit):
        try:
            # find matched rows
            # sql = f"SELECT SQL_CALC_FOUND_ROWS * FROM {table_name} LIMIT {limit} OFFSET {skip}"
            sql = f"SELECT SQL_CALC_FOUND_ROWS * FROM {table_name}"
            self.cursor.execute(sql)
            fields = [field[0] for field in self.cursor.description]
            result = [dict(zip(fields, row)) for row in self.cursor.fetchall()]

            # calculate matched number of rows
            sql_total_count = "SELECT FOUND_ROWS() AS total"
            self.cursor.execute(sql_total_count)
            total_count = self.cursor.fetchall()

            return [result, total_count[0][0]]
        except Exception as e:
            return [e, 500]
    
    def select_as_dataframe(self, table_name, column_list, hash):
        columns = ""
        for i, column in enumerate(column_list):
            columns += column
            if i + 1 < len(column_list): columns += ", "
        
        query = f"SELECT {columns} FROM {table_name}"
        if hash is not None: query += f" WHERE hash={hash}"
        
        try:
            result_dataframe = pd.read_sql(query, self.db)
            return result_dataframe
        except:
            return pd.DataFrame()

    def delete(self, table_name, where, val):
        try:
            sql = f"DELETE FROM {table_name} WHERE {where} = %s"
            self.cursor.execute(sql, val)
            self.db.commit()
            return ["Record successfully deleted", 200] if self.cursor.rowcount > 0 else ["An error occurred while deleting a record", 500]
        except Exception as e:
            return [e, 500]