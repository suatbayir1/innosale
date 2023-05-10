#!pip install plotly.express
import pandas as pd
import open3d as o3d
import numpy as np
import copy
import point_cloud_utils as pcu
import math
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go

def clust():
    #read mesh files
    SOURCE_PCD =  o3d.io.read_triangle_mesh("/root/service_3d/server/static/convertedfiles2/001_2020_Teklifid_5.ply")

    pcd = SOURCE_PCD.sample_points_poisson_disk(number_of_points=10000)
    pcd.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=0.1, max_nn=16), fast_normal_computation=True)
    pcd.paint_uniform_color([0.6, 0.6, 0.6])

    plane_model, inliers = pcd.segment_plane(distance_threshold=0.01, ransac_n = 3, num_iterations=10000)
    [a, b, c, d] = plane_model

    inlier_cloud = pcd.select_by_index(inliers)
    outlier_cloud = pcd.select_by_index(inliers, invert=True)
    inlier_cloud.paint_uniform_color([1, 0, 0])
    outlier_cloud.paint_uniform_color([0.6, 0.6, 0.6])
    labels = np.array(pcd.cluster_dbscan(eps=0.05, min_points=10))

    max_label = labels.max()
    colors = plt.get_cmap("tab20")(labels / (max_label 
    if max_label > 0 else 1))
    colors[labels < 0] = 0
    pcd.colors = o3d.utility.Vector3dVector(colors[:, :3])
    segment_models={}
    segments={}
    max_plane_idx=20
    rest=pcd
    pcl = o3d.geometry.PointCloud()

    for i in range(max_plane_idx):
        colors = plt.get_cmap("tab20")(i)
        segment_models[i], inliers = rest.segment_plane(
        distance_threshold = 0.01,ransac_n = 3,num_iterations=10000)
        
        segments[i] = rest.select_by_index(inliers)

        segments[i].paint_uniform_color(list(colors[:3]))
        pcl += segments[i]
        rest = rest.select_by_index(inliers, invert=True)


    pcl += rest
    print("fghjkl")
    return pcl
clust()