// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { PART_BENDS, STL_DICT, OPERATIONS_PRESET } from "./threejsTypes";

export const set_part_bends = (payload) => {
    return {
        type: PART_BENDS,
        payload,
    }
}

export const set_stl_dict = (payload) => {
    return {
        type: STL_DICT,
        payload,
    }
}

export const set_operations_preset = (payload) => {
    return {
        type: OPERATIONS_PRESET,
        payload,
    }
}




// Redux Thunk

export const save_part_bends = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/part_bend/save_part_bends`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_part_bends(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(set_part_bends([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const load_part_bends = (payload) => {
    return (dispatch) => {
        dispatch(set_part_bends({}))
        let url = `${process.env.REACT_APP_API_URL2}/part_bend/load_part_bends`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_part_bends(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(set_part_bends({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const get_stl_dict = () => {
    return (dispatch) => {
        dispatch(set_stl_dict({}))
        let url = `${process.env.REACT_APP_API_URL2}/part_bend/get_stl_dict`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_stl_dict(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(set_stl_dict({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const save_preset = (payload) => {
    return (dispatch) => {
        dispatch(set_operations_preset({}))
        let url = `${process.env.REACT_APP_API_URL2}/part_operation/save_preset`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_operations_preset(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(set_operations_preset({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const load_preset = (payload) => {
    return (dispatch) => {
        dispatch(set_operations_preset({}))
        let url = `${process.env.REACT_APP_API_URL2}/part_operation/load_preset`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_operations_preset(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(set_operations_preset({}));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}



