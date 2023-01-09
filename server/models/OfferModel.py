# Entities
from entities.Part import Part
import os

# Middlewares
from middlewares.Base import Base

# Core
from core.database.MySQL import MySQL

class OfferModel(Base):
    def __init__(self):
        self.base = Base()
        self.table_name = "offers"
    
    def add(self, offer):
        try: 
            print(offer)
            result = self.base.mysql.insert(
                table_name = self.table_name,
                columns = """
                    company_name, date, description
                """,
                column_types = "%s, %s, %s",
                val = ([offer.company_name, offer.date, offer.description]) 
            )

            return result
        except Exception as e:
            return [e, 500]

    def get_all(self, skip: int, limit: int):
        try:
            return self.base.mysql.select_all_skip_limit(
                table_name = self.table_name, 
                skip = skip,
                limit = limit
            )
        except Exception as e:
            return [e, 500]

    def update(self, params):
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
                table_name = self.table_name,
                columns = columns[:-2],
                where = where,
                val = val
            )

            return result
        except Exception as e:
            return [e, 500]