// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { UPLOAD_AUDIO_FILE, SET_AUDIOS } from "./nlpTypes";

// Actions
import { setOverlay } from "../store/index";

export const setAudios = (payload) => {
    return {
        type: SET_AUDIOS,
        payload,
    }
}

// Redux Thunk
export const getAllAudios = () => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/whisper/getAllAudios`;
        axios
            .get(url)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(setAudios(response.data.data));
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const uploadAudioFile = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/whisper/uploadAudio`;
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getAllAudios());
                }
            })
            .catch(err => {
                console.log(err);
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const deleteAudioFile = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/whisper/deleteAudio/${id}`;

        axios
            .delete(url)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(getAllAudios());
                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}