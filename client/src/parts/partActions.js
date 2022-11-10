// Libraries
import axios from "axios";

// Types
import { GET_PARTS } from "./partTypes";

export const setParts = (payload) => {
    return {
        type: GET_PARTS,
        payload,
    }
}

// Redux Thunk
export const getParts = () => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/part/getAll`;

        axios
            .get(url)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    dispatch(setParts({
                        data: response.data.data,
                        total_count: response.data.total_count
                    }));
                }
            })
            .catch(err => {
                console.log(err);
                // dispatch(getAllDTs([]));
                // NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}
