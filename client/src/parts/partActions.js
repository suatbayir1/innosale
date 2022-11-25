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
                if (response.status === 200) {
                    console.log(typeof response.data.total_count)
                    dispatch(setParts({
                        result: response.data.data,
                        count: response.data.total_count
                    }));
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}
