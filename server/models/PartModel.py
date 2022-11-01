# Entities
from entities.Part import Part
import os

# Core
from core.database.MySQL import MySQL

class PartModel():
    def __init__(self):
        self.mysql = MySQL(
            os.environ.get('DATABASE_HOST'), 
            os.environ.get('DATABASE_USER'), 
            os.environ.get('DATABASE_PASSWORD'), 
            os.environ.get('DATABASE_NAME')
            )
        self.table_name = "parts"
    
    def add(self, part):
        try: 
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
            return [e, code]