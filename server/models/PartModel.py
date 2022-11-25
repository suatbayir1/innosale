# Entities
from entities.Part import Part
import os

# Middlewares
from middlewares.Base import Base

# Core
from core.database.MySQL import MySQL

class PartModel(Base):
    def __init__(self):
        self.mysql = MySQL(
            os.environ.get('DATABASE_HOST'), 
            os.environ.get('DATABASE_USER'), 
            os.environ.get('DATABASE_PASSWORD'), 
            os.environ.get('DATABASE_NAME')
            )
        self.base = Base()
        self.table_name = "parts"
    
    def add(self, part):
        try: 
            print("model", part.teklif_id)
            result = self.mysql.insert(
                table_name = self.table_name,
                columns = """
                    teklif_id, teklif_no, teklif_talep_rev_no, sac_kalinlik, sac_cinsi, 
                    net_x, net_y, net_xy_division, kontur_boyu, acinim_yuzey_alani, 
                    sac_ts_max, sac_uzama, sertlik, hazirlanma_tarihi, tonaj
                """,
                column_types = "%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s",
                val = ([
                    part.teklif_id,  part.teklif_no, part.teklif_talep_rev_no, part.sac_kalinlik, part.sac_cinsi,
                    part.net_x, part.net_y, part.net_xy_division, part.kontur_boyu, part.acinim_yuzey_alani,
                    part.sac_ts_max, part.sac_uzama, part.sertlik, part.hazirlama_tarihi, part.tonaj]) 
            )

            return result
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

            result = self.mysql.update(
                table_name = self.table_name,
                columns = columns[:-2],
                where = where,
                val = val
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
