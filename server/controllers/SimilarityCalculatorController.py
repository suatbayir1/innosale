# Libraries
from flask_classful import FlaskView, route
from flask import request
from helpers.similarity_calculator import table_generate2, fn, get_filtered_files, mahalanobis_closest_part, closest_parts_both
from middlewares.Base import Base
from helpers.calculate_metal import get_values


class SimilarityCalculatorController(FlaskView):
    def __init__(self):
        self.base = Base()
        pass

    @route("/calculatefeatures", methods = ["POST"])
    def calculate_feature(self):
        selected_file = request.values["selectedFile"]
        file_list = request.values.getlist("fileList")
        
        if selected_file == "":
            print("FAIL")
            return self.base.response([],"Fail")
        
        return self.base.response(mahalanobis_closest_part(selected_file, file_list,5), "Success")
        
    @route("calculatehybrid", methods = ["POST"])
    def calculate_hybrid(self):
        selected_file = request.values["selectedFile"]
        selection = request.values["selection"]
        file_list = request.values.getlist("fileList")
        
        if selected_file == "":
            print("FAIL")
            return self.base.response([],"Fail")
    
        return self.base.response(closest_parts_both(selected_file, selection, file_list), "Success")

    
    @route("/test", methods = ["GET"])
    def test(self):
        return {"test": "test"}
    
    @route("/geturl/<id>", methods = ["GET"])
    def geturl(self, id):
        path = "http://localhost:5000/static/files/" + str(id) + ".ply"
        return self.base.response({"url": path}, "Success")

    @route("/calculate", methods = ["POST"])
    def calculate(self):    
        
        selected_file = request.values["selectedFile"]
        selection = request.values["selection"]
        file_list = request.values.getlist("fileList")
                
        if selected_file == "":
            print("FAIL")
            return self.base.response([],"Fail")
        
        return self.base.response(table_generate2(selected_file, selection, file_list, 5), "Success")

    @route("/getall", methods = ["GET"])
    def get(self):
        return self.base.response(fn(), "Success")
    
    @route("/getfeatures/<filename>", methods = ["GET"])
    def getfeatures(self, filename):
        return self.base.response(get_values(filename), "Success")
    
    @route("/getfilteredparts", methods = ["POST"])
    def getFilteredParts(self):
        # Get POST data
                
        filters = {
            "sac": float(request.values["sac"]),
            "acinim_x": float(request.values["acinim_x"]),
            "acinim_y": float(request.values["acinim_y"]),
            "kontur": float(request.values["kontur"]),
            "alan": float(request.values["alan"]),
            
            "sac_range": float(request.values["sac_range"]),
            "acinim_x_range": float(request.values["acinim_x_range"]),
            "acinim_y_range": float(request.values["acinim_y_range"]),
            "kontur_range": float(request.values["kontur_range"]),
            "alan_range": float(request.values["alan_range"])
        }
        
        return self.base.response(get_filtered_files(filters), "Success")
        #return {"test": "test"}

        
