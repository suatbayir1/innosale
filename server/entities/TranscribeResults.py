class TranscribeResults():
    def __init__(
        self,
        hash: str,
        sound_len: int,
        tiny_time: int,
        tiny_result: str,
        base_time: int,
        base_result: str,
        small_time: int,
        small_result: str,
        medium_time: int,
        medium_result: str,
        large_time: int,
        large_result: str
    ):
        self.hash = hash
        self.sound_len = sound_len
        self.tiny_time = tiny_time
        self.tiny_result = tiny_result
        self.base_time = base_time
        self.base_result = base_result
        self.small_time = small_time
        self.small_result = small_result
        self.medium_time = medium_time
        self.medium_result = medium_result
        self.large_time = large_time
        self.large_result = large_result
    
    @property
    def hash(self):
        return self._hash
    
    @hash.setter
    def hash(self, value):
        self._hash = value

    @property
    def sound_len(self):
        return self._sound_len
    
    @sound_len.setter
    def sound_len(self, value):
        self._sound_len = value

    @property
    def tiny_time(self):
        return self._tiny_time
    
    @tiny_time.setter
    def tiny_time(self, value):
        self._tiny_time = value

    @property
    def tiny_result(self):
        return self._tiny_result
    
    @tiny_result.setter
    def tiny_result(self, value):
        self._tiny_result = value

    @property
    def base_time(self):
        return self._base_time
    
    @base_time.setter
    def base_time(self, value):
        self._base_time = value

    @property
    def base_result(self):
        return self._base_result
    
    @base_result.setter
    def base_result(self, value):
        self._base_result = value

    @property
    def small_time(self):
        return self._small_time
    
    @small_time.setter
    def small_time(self, value):
        self._small_time = value

    @property
    def small_result(self):
        return self._small_result
    
    @small_result.setter
    def small_result(self, value):
        self._small_result = value

    @property
    def medium_time(self):
        return self._medium_time
    
    @medium_time.setter
    def medium_time(self, value):
        self._medium_time = value

    @property
    def medium_result(self):
        return self._medium_result
    
    @medium_result.setter
    def medium_result(self, value):
        self._medium_result = value

    @property
    def large_time(self):
        return self._large_time
    
    @large_time.setter
    def large_time(self, value):
        self._large_time = value

    @property
    def large_result(self):
        return self._large_result
    
    @large_result.setter
    def large_result(self, value):
        self._large_result = value
