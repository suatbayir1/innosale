// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { GET_PARTS, TEKLIF_ID_LIST, SIMILAR_PARTS } from "./spfTypes";

// Actions
import { setOverlay, setOfferDetailPageLoading } from "../store";

export const setParts = (payload) => {
    return {
        type: GET_PARTS,
        payload,
    }
}

export const set_teklif_ids = (payload) => {
    return {
        type: TEKLIF_ID_LIST,
        payload,
    }
}

export const set_similar_parts = (payload) => {
    return {
        type: SIMILAR_PARTS,
        payload,
    }
}


// Redux Thunk

export const get_teklif_ids = () => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/three_file/get_teklif_ids`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_teklif_ids(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(set_teklif_ids([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const get_similar_parts = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/similarity_icp/get_similar_parts`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_similar_parts(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(set_similar_parts([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}



export const getParts = () => {
    return (dispatch, getState) => {
        //setPartsGridLoading(true);
        let url = `${process.env.REACT_APP_API_URL}/part/getAll`;

        axios
            .get(url)
            .then(response => {
                //if (response.status === 200) {
                //    dispatch(setParts({
                //        result: response.data.data,
                //        count: response.data.total_count
                //    }));
                //}
            })
            .catch(err => {
                //dispatch(setParts({
                //    result: [],
                //    count: 0
                //}));
                //NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                //dispatch(setPartsGridLoading(false));
            });
    }
}