# Entities
from entities.Operation import Operation
import os

# Core
from core.database.MySQL import MySQL

# Middlewares
from middlewares.Base import Base

class OperationModel(Base):
    def __init__(self):
        self.table_name = "operations"
        self.base = Base()

    def add(self, operation):
        try: 
            print(operation.teklif_no)
            result = self.base.mysql.insert(
                table_name = self.table_name,
                columns = """
                parca_no, teklif_no, teklif_id, teklif_talep_rev_no, teklif_parca_rev_no, operasyon_no, operasyon_adi,
                rl, presler, kalip_boyut_x, kalip_boyut_y, kalip_boyut_z, kalip_agirlik, euro_kg, doluluk, malzeme_mly,
                standart_mly, kaplama_mly, isil_islem_mly, isil_islem_tip, model_mly, CAD, CAM, TwoD, BCNC, KCNC,
                GCNC, MONTAJ, DNM, OLCUM, iscilik_mly, iscilik_saat, toplam_mly
                """,
                column_types = """%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                """,
                val = ([
                    operation.parca_no, operation.teklif_no, operation.teklif_id, operation.teklif_talep_rev_no, operation.teklif_parca_rev_no,
                    operation.operasyon_no, operation.operasyon_adi, operation.rl, operation.presler, operation.kalip_boyut_x, operation.kalip_boyut_y,
                    operation.kalip_boyut_z, operation.kalip_agirlik, operation.euro_kg, operation.doluluk, operation.malzeme_mly, operation.standart_mly,
                    operation.kaplama_mly, operation.isil_islem_mly, operation.isil_islem_tip, operation.model_mly, operation.CAD, operation.CAM,
                    operation.TwoD, operation.BCNC, operation.KCNC, operation.GCNC, operation.MONTAJ, operation.DNM, operation.OLCUM, operation.iscilik_mly,
                    operation.iscilik_saat, operation.toplam_mly
                ]) 
            )

            return result
        except Exception as e:
            return [e, code]

    def get_all(self, skip: int, limit: int):
        try:
            return self.base.mysql.select_all_skip_limit(
                table_name = self.table_name, 
                skip = skip,
                limit = limit
            )
        except Exception as e:
            return [e, 500]