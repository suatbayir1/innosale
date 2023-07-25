// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { FILES_LIST, PART_PRESET } from "./threejs_v2Types";

//#region FILES_LIST
export const set_files_list = (payload) => {
    return {
        type: FILES_LIST,
        payload,
    }
}

export const get_files_list = () => {
    return (dispatch) => {
        dispatch(set_files_list("LOADING"))
        let url = `${process.env.REACT_APP_API_URL2}/part_process_operation/get_file_list`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_files_list(response.data.data));
                    console.log("get_files_list", response.data.data)
                }
                else {
                    dispatch(set_files_list([]))
                }
            })
            .catch(error => {
                console.log("get_files_list", error)
                dispatch(set_files_list([]));
                NotificationManager.error(error.response.data.message, 'Error', 3000);
            })
    }
}
//#endregion

//#region PART_PRESET
export const set_part_preset = (payload) => {
    return {
        type: PART_PRESET,
        payload,
    }
}

export const load_part_preset = (payload) => {
    return (dispatch) => {
        dispatch(set_part_preset("LOADING"))
        let url = `${process.env.REACT_APP_API_URL2}/part_process_operation/load_part_preset`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_part_preset(response.data.data));
                    console.log("load_part_preset", response.data.data)
                }
                else {
                    dispatch(set_part_preset([]))
                }
            })
            .catch(error => {
                console.log("load_part_preset", error)
                dispatch(set_part_preset([]));
                NotificationManager.error(error.response.data.message, 'Error', 3000);
            })
    }
}

export const save_part_preset = (payload) => {
    return (dispatch) => {
        dispatch(set_part_preset("LOADING"))
        let url = `${process.env.REACT_APP_API_URL2}/part_process_operation/save_part_preset`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(set_part_preset(response.data.data));
                    console.log("save_part_preset", response.data.data)
                }
                else {
                    dispatch(set_part_preset([]))
                }
            })
            .catch(error => {
                console.log("save_part_preset", error)
                dispatch(set_part_preset([]));
                NotificationManager.error(error.response.data.message, 'Error', 3000);
            })
    }
}
//#endregion