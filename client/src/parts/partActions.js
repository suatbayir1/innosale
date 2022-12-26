// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { GET_PARTS, SET_PARTS_GRID_LOADING, SET_PART_OVERLAY_LOADING, CONVERT_PART_MODEL_FILE } from "./partTypes";

// Actions
import { setOverlay } from "../store";

export const setParts = (payload) => {
    return {
        type: GET_PARTS,
        payload,
    }
}

export const setPartsGridLoading = (payload) => {
    return {
        type: SET_PARTS_GRID_LOADING,
        payload,
    }
}

export const setPartOverlayLoading = (payload) => {
    return {
        type: SET_PART_OVERLAY_LOADING,
        payload,
    }
}

// Redux Thunk
export const getParts = () => {
    return (dispatch, getState) => {
        setPartsGridLoading(true);
        let url = `${process.env.REACT_APP_API_URL}/part/getAll`;

        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setParts({
                        result: response.data.data,
                        count: response.data.total_count
                    }));
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setPartsGridLoading(false));
            });
    }
}

export const addPart = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/part/add`;
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getParts());
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
                dispatch(setPartsGridLoading(false));
            })
            .finally(() => {
                dispatch(setPartOverlayLoading(false));
            });
    }
}

export const deletePart = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/part/delete/${id}`;

        axios
            .delete(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(getParts());
                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const updatePart = (payload, formData) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/part/update`;
        axios
            .put(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(updatePartModelFile(formData))
                }
            })
            .catch(err => {
                dispatch(setPartOverlayLoading(false));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const updatePartModelFile = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/part/updateModelFile`;
        axios
            .put(url, payload)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getParts());
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setPartOverlayLoading(false));
            })
    }
}