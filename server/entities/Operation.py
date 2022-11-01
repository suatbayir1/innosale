class Operation():
    def __init__(
        self,
        parca_no: str, 
        teklif_talep_rev_no: int, 
        teklif_id: int, 
        teklif_no: str, 
        teklif_parca_rev_no: int, 
        operasyon_no: int,
        operasyon_adi: str, 
        rl: str, 
        presler: str, 
        kalip_boyut_x: int, 
        kalip_boyut_y: int, 
        kalip_boyut_z: int, 
        kalip_agirlik: int,
        euro_kg: float,
        doluluk: float, 
        malzeme_mly: int, 
        standart_mly: int, 
        kaplama_mly: int, 
        isil_islem_mly: int, 
        isil_islem_tip: int, 
        model_mly: int, 
        CAD: int,
        CAM: int, 
        TwoD: int, 
        BCNC: int, 
        KCNC: int, 
        GCNC: int, 
        MONTAJ: int, 
        DNM: int, 
        OLCUM: int, 
        iscilik_mly: int, 
        iscilik_saat: int, 
        toplam_mly: int
    ):
        print("cons")
        self.parca_no = parca_no
        self.teklif_talep_rev_no = teklif_talep_rev_no
        self.teklif_id = teklif_id
        self.teklif_no = teklif_no
        self.teklif_parca_rev_no = teklif_parca_rev_no
        self.operasyon_no = operasyon_no
        self.operasyon_adi = operasyon_adi
        self.rl = rl
        self.presler = presler
        self.kalip_boyut_x = kalip_boyut_x
        self.kalip_boyut_y = kalip_boyut_y
        self.kalip_boyut_z = kalip_boyut_z
        self.kalip_agirlik = kalip_agirlik
        self.euro_kg = euro_kg
        self.doluluk = doluluk
        self.malzeme_mly = malzeme_mly
        self.standart_mly = standart_mly
        self.kaplama_mly = kaplama_mly
        self.isil_islem_mly = isil_islem_mly
        self.isil_islem_tip = isil_islem_tip
        self.model_mly = model_mly
        self.CAD = CAD
        self.CAM = CAM
        self.TwoD = TwoD
        self.BCNC = BCNC
        self.KCNC = KCNC
        self.GCNC = GCNC
        self.MONTAJ = MONTAJ
        self.DNM = DNM
        self.OLCUM = OLCUM
        self.iscilik_mly = iscilik_mly
        self.iscilik_saat = iscilik_saat
        self.toplam_mly = toplam_mly
    
    @property
    def parca_no(self):
        return self._parca_no
    
    @parca_no.setter
    def parca_no(self, value):
        self._parca_no = value

    @property
    def teklif_talep_rev_no(self):
        return self._teklif_talep_rev_no
    
    @teklif_talep_rev_no.setter
    def teklif_talep_rev_no(self, value):
        self._teklif_talep_rev_no = value

    @property
    def teklif_id(self):
        return self._teklif_id
    
    @teklif_id.setter
    def teklif_id(self, value):
        self._teklif_id = value

    @property
    def teklif_no(self):
        return self._teklif_no
    
    @teklif_no.setter
    def teklif_no(self, value):
        self._teklif_no = value

    @property
    def teklif_parca_rev_no(self):
        return self._teklif_parca_rev_no
    
    @teklif_parca_rev_no.setter
    def teklif_parca_rev_no(self, value):
        self._teklif_parca_rev_no = value

    @property
    def operasyon_no(self):
        return self._operasyon_no
    
    @operasyon_no.setter
    def operasyon_no(self, value):
        self._operasyon_no = value

    @property
    def operasyon_adi(self):
        return self._operasyon_adi
    
    @operasyon_adi.setter
    def operasyon_adi(self, value):
        self._operasyon_adi = value

    @property
    def rl(self):
        return self._rl
    
    @rl.setter
    def rl(self, value):
        self._rl = value

    @property
    def presler(self):
        return self._presler
    
    @presler.setter
    def presler(self, value):
        self._presler = value

    @property
    def kalip_boyut_x(self):
        return self._kalip_boyut_x
    
    @kalip_boyut_x.setter
    def kalip_boyut_x(self, value):
        self._kalip_boyut_x = value

    @property
    def kalip_boyut_y(self):
        return self._kalip_boyut_y
    
    @kalip_boyut_y.setter
    def kalip_boyut_y(self, value):
        self._kalip_boyut_y = value

    @property   
    def kalip_boyut_z(self):
        return self._kalip_boyut_z
    
    @kalip_boyut_z.setter
    def kalip_boyut_z(self, value):
        self._kalip_boyut_z = value

    @property
    def kalip_agirlik(self):
        return self._kalip_agirlik
    
    @kalip_agirlik.setter
    def kalip_agirlik(self, value):
        self._kalip_agirlik = value

    @property
    def euro_kg(self):
        return self._euro_kg
    
    @euro_kg.setter
    def euro_kg(self, value):
        self._euro_kg = value

    @property
    def doluluk(self):
        return self._doluluk
    
    @doluluk.setter
    def doluluk(self, value):
        self._doluluk = value

    @property
    def malzeme_mly(self):
        return self._malzeme_mly
    
    @malzeme_mly.setter
    def malzeme_mly(self, value):
        self._malzeme_mly = value

    @property
    def standart_mly(self):
        return self._standart_mly
    
    @standart_mly.setter
    def standart_mly(self, value):
        self._standart_mly = value

    @property
    def kaplama_mly(self):
        return self._kaplama_mly
    
    @kaplama_mly.setter
    def kaplama_mly(self, value):
        self._kaplama_mly = value

    @property
    def isil_islem_mly(self):
        return self._isil_islem_mly
    
    @isil_islem_mly.setter
    def isil_islem_mly(self, value):
        self._isil_islem_mly = value

    @property
    def isil_islem_tip(self):
        return self._isil_islem_tip
    
    @isil_islem_tip.setter
    def isil_islem_tip(self, value):
        self._isil_islem_tip = value

    @property
    def model_mly(self):
        return self._model_mly
    
    @model_mly.setter
    def model_mly(self, value):
        self._model_mly = value

    @property
    def CAD(self):
        return self._CAD
    
    @CAD.setter
    def CAD(self, value):
        self._CAD = value

    @property
    def CAM(self):
        return self._CAM
    
    @CAM.setter
    def CAM(self, value):
        self._CAM = value

    @property
    def TwoD(self):
        return self._TwoD
    
    @TwoD.setter
    def TwoD(self, value):
        self._TwoD = value

    @property
    def BCNC(self):
        return self._BCNC
    
    @BCNC.setter
    def BCNC(self, value):
        self._BCNC = value

    @property
    def KCNC(self):
        return self._KCNC
    
    @KCNC.setter
    def KCNC(self, value):
        self._KCNC = value

    @property
    def GCNC(self):
        return self._GCNC
    
    @GCNC.setter
    def GCNC(self, value):
        self._GCNC = value

    @property
    def MONTAJ(self):
        return self._MONTAJ
    
    @MONTAJ.setter
    def MONTAJ(self, value):
        self._MONTAJ = value

    @property
    def DNM(self):
        return self._DNM
    
    @DNM.setter
    def DNM(self, value):
        self._DNM = value

    @property
    def OLCUM(self):
        return self._OLCUM
    
    @OLCUM.setter
    def OLCUM(self, value):
        self._OLCUM = value

    @property
    def iscilik_mly(self):
        return self._iscilik_mly
    
    @iscilik_mly.setter
    def iscilik_mly(self, value):
        self._iscilik_mly = value

    @property
    def iscilik_saat(self):
        return self._iscilik_saat
    
    @iscilik_saat.setter
    def iscilik_saat(self, value):
        self._iscilik_saat = value

    @property
    def toplam_mly(self):
        return self._toplam_mly
    
    @toplam_mly.setter
    def toplam_mly(self, value):
        self._toplam_mly = value