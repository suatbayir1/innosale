// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { GET_OPERATIONS, SET_OPERATIONS_GRID_LOADING } from "./operationTypes";

// Actions
import { setOverlay } from "../store";

export const setOperations = (payload) => {
    return {
        type: GET_OPERATIONS,
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
                console.log(response);
                if (response.status === 200) {
                    dispatch(setOperations({
                        result: response.data.data,
                        count: response.data.total_count
                    }));
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setOperationsGridLoading(false));
            });
    }
}