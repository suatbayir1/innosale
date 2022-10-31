tables = [
    {
        "name": "parts",
        "sql": """
            CREATE TABLE IF NOT EXISTS parts (
                id int not null primary key auto_increment,
                teklif_id int,
                teklif_no varchar(50),
                teklif_talep_rev_no int,
                sac_kalinlik float,
                sac_cinsi varchar(50),
                net_x int,
                net_y int,
                net_xy_division float,
                kontur_boyu int,
                acinim_yuzey_alani int,
                sac_ts_max int,
                sac_uzama int,
                sertlik varchar(50),
                hazirlanma_tarihi date,
                tonaj float
                )
        """
    },
    {
        "name": "operations",
        "sql": """
            CREATE TABLE IF NOT EXISTS operations (
                id int not null primary key auto_increment,
                parca_no varchar(255),
                teklif_talep_rev_no int,
                teklif_id int,
                talep_rev_no int,
                teklif_parca_rev_no int,
                operasyon_no int,
                operasyon_adi varchar(255),
                rl varchar(50),
                presler varchar(255),
                kalip_boyut_x int,
                kalip_boyut_y int,
                kalip_boyut_z int,
                kalip_agirlik int,
                euro_kg float,
                doluluk float,
                malzeme_mly int,
                standart_mly int,
                kaplama_mly int,
                isil_islem_mly int,
                isil_islem_tip int,
                model_mly int,
                CAD int,
                CAM int,
                2D int,
                BCNC int,
                KCNC int,
                GCNC int,
                MONTAJ int,
                DNM int,
                OLCUM int,
                iscilik_mly int,
                iscilik_saat int,
                toplam_mly int
            )
        """
    }
]