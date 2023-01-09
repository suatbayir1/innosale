tables = [
    {
        "name": "parts",
        "sql": """
            CREATE TABLE IF NOT EXISTS parts (
                id int not null primary key auto_increment,
                teklif_id int UNIQUE,
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
                hazirlama_tarihi date,
                tonaj float,
                model_path varchar(255) default '',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
                )
        """
    },
    {
        "name": "operations",
        "sql": """
            CREATE TABLE IF NOT EXISTS operations (
                id int not null primary key auto_increment,
                parca_no varchar(255),
                teklif_no varchar(50),
                teklif_id int,
                teklif_talep_rev_no int,
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
                TwoD int,
                BCNC int,
                KCNC int,
                GCNC int,
                MONTAJ int,
                DNM int,
                OLCUM int,
                iscilik_mly int,
                iscilik_saat int,
                toplam_mly int,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            )
        """
    },
    {
        "name": "transcribe_results",
        "sql": """
            CREATE TABLE IF NOT EXISTS transcribe_results (
                hash varchar(64) not null primary key,
                sound_len int not null,
                tiny_time int,
                tiny_result MEDIUMTEXT,
                base_time int,
                base_result MEDIUMTEXT,
                small_time int,
                small_result MEDIUMTEXT,
                medium_time int,
                medium_result MEDIUMTEXT,
                large_time int,
                large_result MEDIUMTEXT
            )
        """
    },
    {
        "name": "audios",
        "sql": """
            CREATE TABLE IF NOT EXISTS audios (
                id int not null primary key auto_increment,
                filename varchar(255),
                path varchar(255),
                model varchar(50),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            )
        """
    },
    {
        "name": "offers",
        "sql": """
            CREATE TABLE IF NOT EXISTS offers (
                id int not null primary key auto_increment,
                company_name varchar(255),
                date date,
                description text,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
                )
        """
    },
]

excel_files = ["ParcaListesi.xlsx", "Operasyonlar.xlsx", "TranscribeResults.xlsx"]