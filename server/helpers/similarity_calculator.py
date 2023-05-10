import pandas as pd
import open3d as o3d
import numpy as np
import itertools
import copy
import os
import point_cloud_utils as pcu
import time
import plotly.express as px
import xlsxwriter
import plotly.graph_objects as go
from .calculate_metal import f, get_values,get_all_values
import math

"""
def mahalanobis_dist(v1,v2,vi):
    delta = np.atleast_2d(v1 - v2)
            
    a = delta * vi
                    
    dist_v = (a * delta.T)
    dist = dist_v.item(0, 0)
    dist = abs(dist)
    return dist
"""

def closest_parts_both(selected_file, selection, file_list):
    feature_table = mahalanobis_closest_part(selected_file, file_list, len(file_list))
    geometric_table = table_generate2(selected_file, selection, file_list, len(file_list))
    
    table = feature_table
    
    for i in range(len(geometric_table[0])):
        index = table[0].index(geometric_table[0][i])
        if index >= 0:
            table[1][index] += geometric_table[1][i]
        else:
            print("err ", index)
    
    table[1], table[0], table[3] = zip(*sorted(zip(table[1], table[0], table[3])))
    
    result = [table[0][0:5], table[1][0:5], 3, table[3][0:5]]
    
    return result

def mahalanobis_closest_part(selected_file, file_list, n):
    n = min(n, len(file_list))

    
    # find i1
    i1 = -1
    for i in range(len(file_list)):
        if file_list[i] == selected_file:
            i1 = i
            break
    
    if i1 == -1:
        return {}
    
    # get feature matrix
    all_vectors = []
        
    for i in range(len(file_list)):
        features = get_all_values(file_list[i])
        
        vector = [features["sac"], features["acinim_x"], features["acinim_y"], features["kontur"], features["alan"],features["SacTsMax"],features["SacUzama"]]
        all_vectors.append(vector)
    
    # calculate
    best_point_list, best_dist_list = mahalanobis_closest_points(i1, np.asarray(all_vectors), n)
    
    theta = 10
    b = min(best_dist_list)
    a = max(best_dist_list)
    
    #k = theta / (a - b)
    #best_dist_list = [math.log(theta + k * (dist - b)) / math.log(theta) for dist in best_dist_list]
           
    k = 1 / (a-b)
    best_dist_list = [round(k * dist, 5) for dist in best_dist_list]
    
    filename_list = [file_list[point].split('.')[0] for point in best_point_list]
    
    result = [filename_list, best_dist_list, 1, all_vectors]
    
    #print(result)
    
    return result
    
    

def mahalanobis_closest_points(i1, all_vectors, n):
    n = min(n, len(all_vectors))

    
    best_point_list = [-1] * n
    best_dist_list = [float('inf')] * n  
    
    # mean center data
    mean = np.mean(all_vectors, axis=0)
    a = all_vectors - mean
    
    # inverse covariance matrix
    v = np.corrcoef(a, rowvar=0)
    v = np.matrix(v)
    vi = np.linalg.inv(v)
    
    for i in range(len(all_vectors)):
        if True:
            # calculate mahalanobis distance
            delta = np.atleast_2d(all_vectors[i1] - all_vectors[i])
            
            a = delta * vi
            
            
            dist_v = (a * delta.T)
            dist = dist_v.item(0, 0)
            dist = abs(dist)
            
            for j in range(n):    
                if (dist < best_dist_list[j]):
                    for k in range(n-1, j, -1):
                        
                        best_dist_list[k] = best_dist_list[k-1]
                        best_point_list[k] = best_point_list[k-1]
                        
                    best_dist_list[j] = dist
                    best_point_list[j] = i
                    break
    
    return best_point_list, best_dist_list

def get_filtered_files(filters):
    sackalinlik = [filters["sac"] - filters["sac_range"], filters["sac"] + filters["sac_range"]]
    netx = [filters["acinim_x"] - filters["acinim_x_range"], filters["acinim_x"] + filters["acinim_x_range"]]
    nety = [filters["acinim_y"] - filters["acinim_y_range"], filters["acinim_y"] + filters["acinim_y_range"]]
    konturboyu = [filters["kontur"] - filters["kontur_range"], filters["kontur"] + filters["kontur_range"]]
    yuzeyalani = [filters["alan"] - filters["alan_range"], filters["alan"] + filters["alan_range"]]
    
    file_list = f(sackalinlik, netx, nety, konturboyu, yuzeyalani)
    return file_list

def fn():
    file_list = os.listdir("/root/innosale/server/static/convertedfiles2")
    return file_list
file2 = fn()


file = []
for i in file2:
    if i != ".DS_Store":
        file.append(i)
print(file)



def table_generate2(selected_file, selection, file_list, n):
    n = min(n, len(file_list))
    
    outputt = []
    table = []
    rmse_ = []
    
    print(file_list)

    for i in file_list:        
        features_dict = get_values(i)
        features_list = [features_dict['sac'], features_dict['acinim_x'], features_dict['acinim_y'], features_dict['kontur'], features_dict['alan']]
        
        print(features_list)
        
        a = "/root/innosale/server/static/convertedfiles2/"
        a += i
        
        inputt = selected_file
        
        input_ = "/root/innosale/server/static/convertedfiles2/"
        input_ += inputt
        
        SOURCE_PCD = o3d.io.read_triangle_mesh(input_)
        TARGET_PCD = o3d.io.read_triangle_mesh(a)

        try:
            #scale source mesh and recenter it
            x,y,z = SOURCE_PCD.get_center().T
            SOURCE_PCD = copy.deepcopy(SOURCE_PCD).translate((-x, -y, -z))
            SOURCE_PCD.scale(1, center= (0,0,0))


            #scale target mesh and recenter it
            x,y,z = TARGET_PCD.get_center().T
            TARGET_PCD = copy.deepcopy(TARGET_PCD).translate((-x, -y, -z))
            TARGET_PCD.scale(1, center= (0,0,0))

            pcd_source = SOURCE_PCD.sample_points_poisson_disk(number_of_points=500, init_factor=5)
            pcd_target = TARGET_PCD.sample_points_poisson_disk(number_of_points=500, init_factor=5)

            threshold = 10000
            trans_init = np.asarray([[1.0, 0.0, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0],
                                            [0.0, 0.0, 1.0, 0.0], [0.0, 0.0, 0.0, 1.0]])

            evaluation = o3d.pipelines.registration.evaluate_registration(
            pcd_source, pcd_target, threshold, trans_init)

            reg_p2p = o3d.pipelines.registration.registration_icp(
            pcd_source, pcd_target, threshold, trans_init,
            o3d.pipelines.registration.TransformationEstimationPointToPoint(),o3d.pipelines.registration.ICPConvergenceCriteria(max_iteration=5))


            rmsee_ = reg_p2p.inlier_rmse
            rmsee_ = rmsee_ / 10
            norm = np.linalg.norm(reg_p2p.transformation, ord=None, axis=None)
            norm1 = np.linalg.norm(reg_p2p.transformation, ord=1, axis=None)
            norm2 = np.linalg.norm(reg_p2p.transformation, ord=2, axis=None)

        except:
            print(input_)
            print(a)
            rmsee_ = 0
            norm = 0
            norm1 = 0
            norm2 = 0

        else:
            print(".")

        #add each values generated for each target object to table

        v = i.split(".")
        rmse_.append(rmsee_)
        table.append([v[0], round(rmsee_,2),norm, norm1, norm2, features_list])

    if selection == "RMSE":
        sort_index = np.argsort(rmse_)
    elif selection == "NORM":
        sort_index = np.argsort(norm1)
    elif selection == "BOTH":
        sort_index = np.argsort(norm2)
    else:
        sort_index = np.argsort(rmse_)
           
        
    a = 0
    arr_ = []
    arr0_ = []
    arr1_ = []
    arr2_ = []
    arr3_ = []
    arr4_ = []
    arr5_ = []


    x = 0
    for i in table:
        if x == n:
            break
        x = x + 1
        arr_.append(table[sort_index[a]])
        print(table[sort_index[a]])
        print("  ")

        #name of target file
        arr0_.append(arr_[a][0])

        #rmse value
        arr1_.append(arr_[a][1])

        #norm0[6]
        arr2_.append(arr_[a][2])
        #norm1[7]
        arr3_.append(arr_[a][3])
        #norm2[8]
        arr4_.append(arr_[a][4])
        
        arr5_.append(arr_[a][5])
        a = a + 1
        
    #print("-------------------------")
    # 0. target name
    outputt.append(arr0_)

    # 1 rmse
    outputt.append(arr1_)

    outputt.append(2)
    
    # 3 norm0
    outputt.append(arr2_)

    # 4 norm1
    outputt.append(arr3_)

    # 5 norm2
    outputt.append(arr4_)
    
    # 6 features
    outputt.append(arr5_)

    # 7 file length
    outputt.append(len(file))

    print(outputt)

    return outputt


file_list = fn()
#print(mahalanobis_closest_part(file_list[0], file_list, 5))
#print(table_generate2(file_list[0], "RMSE", file_list, 5))
print(closest_parts_both(file_list[0], "RMSE", file_list))







