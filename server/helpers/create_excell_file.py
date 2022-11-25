import xlsxwriter
from .table_display import table_generate
# Create an new Excel file and add a worksheet.

def generate_table(dosya, sayı):
    workbook = xlsxwriter.Workbook('static/images/ima.xlsx')
    worksheet = workbook.add_worksheet()

    # Widen the first column to make the text clearer.
    worksheet.set_column('A:A', 30)

    # Insert an image with scaling.
    cell_format1 = workbook.add_format({'bold': True, })
    cell_format2 = workbook.add_format({'bold': True, 'bg_color': '#FFFF00'})
    worksheet.write('A1', 'Input Part:', cell_format2)
    table_output = table_generate(dosya,sayı)
    in_ = table_output[0]
    cell_format = workbook.add_format({'bold': True, })
    worksheet.write('A2', in_, cell_format)
    worksheet.insert_image('A3', "static/images/input.png", {'x_scale': 0.5, 'y_scale': 0.5})

    worksheet.write('A16', 'Part Names:', cell_format2)
    worksheet.write('B16', 'Part Images:', cell_format2)
    worksheet.write('C16', '', cell_format2)

    worksheet.write('H16', 'Transformed Images : ', cell_format2)
    worksheet.write('I16', '', cell_format2)
    worksheet.write('N16', ' Merged Images ', cell_format2)
    worksheet.write('O16', '', cell_format2)
    worksheet.write('R16', ' ICP Results ', cell_format2)
    worksheet.write('Y16', ' Timing Results ', cell_format2)
    worksheet.write('Y16', 'Time Calculations ', cell_format2)
    worksheet.write('U16', '', cell_format2)
    worksheet.write('D16', '', cell_format2)
    worksheet.write('E16', '', cell_format2)
    worksheet.write('F16', '', cell_format2)
    worksheet.write('G16', '', cell_format2)
    worksheet.write('J16', '', cell_format2)
    worksheet.write('K16', '', cell_format2)
    worksheet.write('L16', '', cell_format2)
    worksheet.write('M16', '', cell_format2)
    worksheet.write('P16', '', cell_format2)
    worksheet.write('Q16', '', cell_format2)
    worksheet.write('S16', '', cell_format2)
    worksheet.write('V16', '', cell_format2)
    worksheet.write('X16', '', cell_format2)
    worksheet.write('T16', '', cell_format2)
    worksheet.write('W16', '', cell_format2)
    worksheet.write('Y16', '', cell_format2)
    worksheet.write('AA16', '', cell_format2)
    worksheet.write('AB16', '', cell_format2)
    worksheet.write('AC16', '', cell_format2)
    worksheet.write('Z16', '', cell_format2)



    row = 16
    col = 16
    for i in range(0, 11):
        cell_format = workbook.add_format({'bg_color': '#FFFFFF'})
        worksheet.write(row, col, "" ,cell_format)
        row += 1


    col_ = 24
    row_ = 16
    b_ = 17
    n__ = 19
    cell_format = workbook.add_format({'bold': True, 'bg_color': '#FFFFFF'})

    for i in range(0, int(table_output[20])):
        nb = "static/images/"
        b = str(i)
        b += ".png"
        nb += b
        nx= "B"
        nt = "T"
        na = "A"
        na_1 = "A"
        na_2 = "A"
        na_3 = "A"
        na_4 = "A"
        na_5 = "A"
        ny = "Y"
        nw = "W"
        nww = "W"
        nwww = "W"
        ng = "G"
        nl = "L"
        nu = "U"
        nuu = "U"
        nuuu = "U"
        nv = "V"
        nvv = "V"
        nvvv = "V"
        ns = "R"
        nss = "R"
        ns_norm = "T"
        ns_norm1 = "T"
        ns_norm2 = "T"
        ntt = "T"
        nsss = "R"
        ntttt = "T"
        nttttt = "T"
        nttt = "T"
        n_norm = "R"
        n1_norm = "R"
        n2_norm = "R"
        n_points = "R"
        n_points2 = "T"

        s15 = b_ + 1
        s16 = b_ + 4
        s17 = b_ + 5
        s18 = b_ + 6
        snorm_digit = s18 + 2
        snorm_digit1 = snorm_digit +1
        snorm_digit2 = snorm_digit + 2
        bs = str(s15)
        bs2 = str(s16)
        bs3 = str(s17)
        bs4 = str(s18)
        bx = str(b_)
        b_norm = str(snorm_digit)
        b_norm1 = str(snorm_digit1)
        b_norm2 = str(snorm_digit2)

        #arrange location
        nx += bx
        nt += bx
        n_points += bs
        n_points2 += bs
        na += bx
        na_1 += bs
        na_2 += bs2
        na_3 += bs3
        na_4 += bs4
        na_5 += b_norm
        ny += bx

        nl += bx
        ng += bx
        nu += bs2
        nv += bs2
        nw += bs2
        ns += bx
        nss += bs
        ntt += bs
        nsss += bs2
        nttt += bs2
        ntttt += bs3
        nuu +=bs3
        nuuu += bs4
        nvv += bs3
        nww += bs3
        nttttt += bs4
        nvvv += bs4
        nwww += bs4
        ns_norm += b_norm
        n_norm += b_norm
        ns_norm1 += b_norm1
        n1_norm += b_norm1
        ns_norm2 += b_norm2
        n2_norm += b_norm2



        print(nx)
        print(nt)

        # name of objects in A
        c = table_output[1][i]
        cell_format5 = workbook.add_format({'bold': True, 'bg_color': '#C0C0C0'})
        worksheet.write(na, c, cell_format5)

        #insert image in B
        worksheet.insert_image(nx, nb, {'x_scale': 0.5, 'y_scale': 0.5})


        # transformed image in G
        n = table_output[2][i]
        a2 = "static/images/T"
        a2 += str(n)
        v = ".png"
        a2 += v
        worksheet.insert_image(ng, a2, {'x_scale': 0.5, 'y_scale': 0.5})


        # merged image in L
        n = table_output[2][i]
        a3 = "static/images/merge"
        a3 += str(n)
        v = ".png"
        a3 += v
        worksheet.insert_image(nl, a3, {'x_scale': 0.5, 'y_scale': 0.5})


        # insert Rmse in T
        a = table_output[3][i]
        worksheet.write(nt, a, cell_format)
        worksheet.write(ns, "RMSE: ", cell_format)




        # insert matrix in T
        d = table_output[4][i]
        worksheet.write(nsss, "Transformation Matrix", cell_format)
        worksheet.write(nttt, round(d[0][0], 2), cell_format5)
        worksheet.write(nu, round(d[0][1], 2), cell_format5)
        worksheet.write(nv, round(d[0][2], 2), cell_format5)
        worksheet.write(nw, round(d[0][3], 2), cell_format5)
        worksheet.write(ntttt, round(d[1][0], 2), cell_format5)
        worksheet.write(nuu, round(d[1][1], 2), cell_format5)
        worksheet.write(nvv, round(d[1][2], 2), cell_format5)
        worksheet.write(nww, round(d[1][3], 2), cell_format5)
        worksheet.write(nttttt, round(d[2][0], 2), cell_format5)
        worksheet.write(nuuu, round(d[2][1], 2), cell_format5)
        worksheet.write(nvvv, round(d[2][2], 2), cell_format5)
        worksheet.write(nwww, round(d[2][3], 2), cell_format5)


        # insert norm
        g = table_output[5][i]
        worksheet.write(n_norm, "L0 Norm", cell_format)
        worksheet.write(ns_norm, round(g, 2), cell_format)

        #insert norm1
        h = table_output[6][i]
        worksheet.write(n1_norm, "L1 Norm", cell_format)
        worksheet.write(ns_norm1, round(h, 2), cell_format)

        #insert norm2
        ı = table_output[7][i]
        worksheet.write(n2_norm, "L2 Norm", cell_format)
        worksheet.write(ns_norm2, round(ı, 2), cell_format)

        # insert num_points
        v = table_output[8][i]
        worksheet.write(n_points, "Sample Points", cell_format)
        worksheet.write(n_points2, v, cell_format)

        cell_formatt = workbook.add_format({'bold': True})

        #features
        st_vol = "Volume:  "
        f = round(table_output[9][i], 2)
        s = str(f)
        st_vol += s
        worksheet.write(na_1, st_vol, cell_formatt)

        st_deltax ="Delta x:  "
        j = round(table_output[10][i], 2)
        sj = str(j)
        st_deltax += sj
        worksheet.write(na_2, st_deltax, cell_formatt)

        st_deltay ="Delta y:  "
        k_ = round(table_output[11][i], 2)
        sk = str(k_)
        st_deltay += sk
        worksheet.write(na_3, st_deltay, cell_formatt)

        st_deltaz ="Delta z:  "
        z_ = round(table_output[12][i], 2)
        sk = str(z_)
        st_deltaz += sk
        worksheet.write(na_4, st_deltaz, cell_formatt)


        #Timing results in Z

        e = table_output[13][i]
        worksheet.write(row_, col_, "Total time for ICP", cell_format)
        worksheet.write(row_, col_ + 3 , e, cell_format)


        p_ = table_output[14][i]
        worksheet.write(row_ + 2 , col_, "Source Translation time", cell_format)
        worksheet.write(row_ + 2, col_ + 3, p_, cell_format)


        q_ = table_output[15][i]
        worksheet.write(row_ + 4, col_, "Translation matrix calculation", cell_format)
        worksheet.write(row_ + 4, col_ + 3, q_, cell_format)


        tri_ = table_output[16][i]
        st_tri ="Triangle number:  "
        sk = str(tri_)
        st_tri += sk
        coll2=0
        worksheet.write(row_ + 8, coll2, st_tri, cell_format)

        clus_ = table_output[17][i]
        clust_ = "Number of clusters:  "
        sk = str(clus_)
        clust_ += sk
        worksheet.write(row_ + 9, coll2, clust_, cell_format)


        #icp volume_ratio
        vt_vol = table_output[18][i]
        a_str = "R"
        a_str += str(n__)

        worksheet.write(a_str, "Volume ratio of Target", cell_format)
        a_str = "T"
        a_str += str(n__)
        worksheet.write(a_str, round(vt_vol,2), cell_format)


        vs_vol = table_output[19][i]
        a_str = "R"
        a_str += str(n__ + 1)

        worksheet.write(a_str, "Volume ratio of Source", cell_format)
        a_str = "T"
        a_str += str(n__ + 1)
        worksheet.write(a_str, round(vs_vol,2), cell_format)


        b_ += 15
        n__ += 15
        row_ += 15
        


    workbook.close()

quit()
