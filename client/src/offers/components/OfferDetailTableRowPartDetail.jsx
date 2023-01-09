// Libraries
import React, { Component } from 'react';
import Grid from '@mui/material/Grid';

// Helpers
import { dateToTableFormat } from '../../shared/helpers/convert';

class OfferDetailTableRowPartDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allowedKeys: [
                "acinim_yuzey_alani", "hazirlama_tarihi", "sac_ts_max", "sac_uzama",
                "sertlik", "teklif_talep_rev_no", "tonaj", "net_xy_division", "createdAt", "updatedAt"
            ],
            titles: {
                acinim_yuzey_alani: "Açınım Yüzey Alanı",
                hazirlama_tarihi: "Hazırlama Tarihi",
                sac_ts_max: "Sac Ts Max",
                sac_uzama: "Sac Uzama",
                sertlik: "Sertlik",
                teklif_talep_rev_no: "Teklif Talep Rev No",
                tonaj: "Tonaj",
                net_xy_division: "Net X/Y",
                createdAt: "Oluşturulma Tarihi",
                updatedAt: "Güncelleme Tarihi"
            }
        }
    }

    getValue = (row, key) => {
        switch (key) {
            case "hazirlama_tarihi":
            case "createdAt":
            case "updatedAt":
                return dateToTableFormat(row[key])
            default: return row[key]
        }
    }

    render() {
        const { allowedKeys, titles } = this.state;
        const { row } = this.props;

        return (
            <Grid container spacing={2}>
                {
                    Object.keys(row).map((key, idx) => {
                        if (allowedKeys.includes(key))
                            return <Grid key={idx} item xs={2} md={2}>
                                <div>
                                    <p className="text-2xl font-semibold tracking-tight text-slate-900">
                                        {titles[key]}
                                    </p>
                                    <p className="text-lg text-gray-400">
                                        {this.getValue(row, key)}
                                    </p>
                                </div>
                            </Grid>
                    })
                }
            </Grid>
        );
    }
};

export default OfferDetailTableRowPartDetail;