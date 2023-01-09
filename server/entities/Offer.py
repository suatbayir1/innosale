class Offer():
    def __init__(
        self, 
        company_name: str, 
        date: str,
        description: str,
    ):
        self.company_name = company_name
        self.date = date
        self.description = description
    
    @property
    def company_name(self):
        return self._company_name
    
    @company_name.setter
    def company_name(self, value):
        self._company_name = value
    
    @property
    def date(self):
        return self._date
    
    @date.setter
    def date(self, value):
        self._date = value

    @property
    def description(self):
        return self._description
    
    @description.setter
    def description(self, value):
        self._description = value