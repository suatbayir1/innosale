class Part():
    def __init__(
        self, 
        teklif_no: str, 
        teklif_talep_rev_no: int, 
        teklif_id: int,
        sac_kalinlik: float,
        sac_cinsi: str,
        net_x: int,
        net_y: int,
        kontur_boyu: int,
        acinim_yuzey_alani: int,
        sac_ts_max: int,
        sac_uzama: int,
        sertlik: str,
        hazirlama_tarihi: str,
        model_path: str
    ):
        self.teklif_no = teklif_no
        self.teklif_talep_rev_no = teklif_talep_rev_no
        self.teklif_id = teklif_id
        self.sac_kalinlik = sac_kalinlik
        self.sac_cinsi = sac_cinsi
        self.net_x = net_x
        self.net_y = net_y
        self.kontur_boyu = kontur_boyu
        self.acinim_yuzey_alani = acinim_yuzey_alani
        self.sac_ts_max = sac_ts_max
        self.sac_uzama = sac_uzama
        self.sertlik = sertlik
        self.hazirlama_tarihi = hazirlama_tarihi
        self.tonaj = (sac_kalinlik, kontur_boyu, sac_ts_max)
        self.net_xy_division = (net_x, net_y)
        self.model_path = model_path
    
    @property
    def teklif_id(self):
        return self._teklif_id
    
    @teklif_id.setter
    def teklif_id(self, value):
        self._teklif_id = value
    
    @property
    def teklif_talep_rev_no(self):
        return self._teklif_talep_rev_no
    
    @teklif_talep_rev_no.setter
    def teklif_talep_rev_no(self, value):
        self._teklif_talep_rev_no = value

    @property
    def teklif_no(self):
        return self._teklif_no
    
    @teklif_no.setter
    def teklif_no(self, value):
        self._teklif_no = value

    @property
    def sac_kalinlik(self):
        return self._sac_kalinlik
    
    @sac_kalinlik.setter
    def sac_kalinlik(self, value):
        self._sac_kalinlik = value

    @property
    def sac_cinsi(self):
        return self._sac_cinsi
    
    @sac_cinsi.setter
    def sac_cinsi(self, value):
        self._sac_cinsi = value

    @property
    def net_x(self):
        return self._net_x
    
    @net_x.setter
    def net_x(self, value):
        self._net_x = value

    @property
    def net_y(self):
        return self._net_y
    
    @net_y.setter
    def net_y(self, value):
        self._net_y = value

    @property
    def kontur_boyu(self):
        return self._kontur_boyu
    
    @kontur_boyu.setter
    def kontur_boyu(self, value):
        self._kontur_boyu = value

    @property
    def acinim_yuzey_alani(self):
        return self._acinim_yuzey_alani
    
    @acinim_yuzey_alani.setter
    def acinim_yuzey_alani(self, value):
        self._acinim_yuzey_alani = value

    @property
    def sac_ts_max(self):
        return self._sac_ts_max
    
    @sac_ts_max.setter
    def sac_ts_max(self, value):
        self._sac_ts_max = value

    @property
    def sac_uzama(self):
        return self._sac_uzama
    
    @sac_uzama.setter
    def sac_uzama(self, value):
        self._sac_uzama = value

    @property
    def sertlik(self):
        return self._sertlik
    
    @sertlik.setter
    def sertlik(self, value):
        self._sertlik = value

    @property
    def hazirlama_tarihi(self):
        return self._hazirlama_tarihi
    
    @hazirlama_tarihi.setter
    def hazirlama_tarihi(self, value):
        self._hazirlama_tarihi = value

    @property
    def tonaj(self):
        return self._tonaj
    
    @tonaj.setter
    def tonaj(self, value):
        sac_kalinlik, kontur_boyu, sac_ts_max = value
        self._tonaj = sac_kalinlik * kontur_boyu * sac_ts_max

    @property
    def net_xy_division(self):
        return self._net_xy_division
    
    @net_xy_division.setter
    def net_xy_division(self, value):
        net_x, net_y = value

        try:
            self._net_xy_division = net_x / net_y
        except ZeroDivisionError:
            self._net_xy_division = 0

    @property
    def model_path(self):
        return self._model_path
    
    @model_path.setter
    def model_path(self, value):
        self._model_path = value