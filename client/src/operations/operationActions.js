// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { GET_OPERATIONS, SET_OPERATIONS_GRID_LOADING, GET_OPERATIONS_BY_OFFER_ID } from "./operationTypes";

// Actions
import { setOverlay } from "../store";

export const setOperations = (payload) => {
    return {
        type: GET_OPERATIONS,
        payload,
    }
}

export const setOperationsByOfferId = (payload) => {
    return {
        type: GET_OPERATIONS_BY_OFFER_ID,
        payload,
    }
}

export const setOperationsGridLoading = (payload) => {
    return {
        type: SET_OPERATIONS_GRID_LOADING,
        payload,
    }
}

// Redux Thunk
export const getOperations = () => {
    return (dispatch, getState) => {
        setOperationsGridLoading(true);
        let url = `${process.env.REACT_APP_API_URL}/operation/getAll`;

        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setOperations({
                        result: response.data.data,
                        count: response.data.total_count
                    }));
                }
            })
            .catch(err => {
                dispatch(setOperations({
                    result: [],
                    count: 0
                }));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setOperationsGridLoading(false));
            });
    }
}

export const getOperationsByOfferId = (id) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL}/operation/getOperationsByOfferId/${id}`;

        axios
            .get(url)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(setOperationsByOfferId(response.data.data));
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
                dispatch(setOperationsByOfferId([]));
            })
    }
}

export const addOperation = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/operation/add`;
        axios
            .post(url, payload)
            .then(response => {
                console.log("response", response);
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getOperationsByOfferId(payload.teklif_id))
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}