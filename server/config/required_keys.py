part = dict(
    add = ["teklif_no", "teklif_talep_rev_no", "teklif_id", "sac_kalinlik", "sac_cinsi", "net_x", "net_y", "kontur_boyu", "acinim_yuzey_alani", "sac_ts_max", "sac_uzama", "sertlik", "hazirlama_tarihi"
    ],
    update = [],
)

operation = dict(
    add = ["parca_no", "teklif_talep_rev_no", "teklif_id", "teklif_no", "teklif_parca_rev_no", "operasyon_no",
        "operasyon_adi", "rl", "presler", "kalip_boyut_x", "kalip_boyut_y", "kalip_boyut_z", "kalip_agirlik", "euro_kg",
        "doluluk", "malzeme_mly", "standart_mly", "kaplama_mly", "isil_islem_mly", "isil_islem_tip", "model_mly", "CAD",
        "CAM", "TwoD", "BCNC", "KCNC", "GCNC", "MONTAJ", "DNM", "OLCUM", "iscilik_mly", "iscilik_saat", "toplam_mly"
    ]
)

offer = dict(
    add = ["companyName", "date", "description"],
    update = [],
)

transcribe_results = dict(
    add = [
        "hash", "sound_len", "tiny_time", "tiny_result",
        "base_time", "base_result", "small_time", "small_result",
        "medium_time", "medium_result", "large_time", "large_result"
    ]
)

nlp = dict(
    update = [],
)