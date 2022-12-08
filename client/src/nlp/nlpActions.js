// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { UPLOAD_AUDIO_LOADING, SET_AUDIOS } from "./nlpTypes";

// Actions
import { setOverlay } from "../store/index";

export const setAudios = (payload) => {
    return {
        type: SET_AUDIOS,
        payload,
    }
}

export const setUploadAudioLoading = (payload) => {
    return {
        type: UPLOAD_AUDIO_LOADING,
        payload,
    }
}

// Redux Thunk
export const getAllAudios = () => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/file/getAllAudios`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setAudios(response.data.data));
                }
            })
            .catch(err => {
                dispatch(setAudios([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const uploadAudioFile = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/file/uploadAudio`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getAllAudios());
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setUploadAudioLoading(false));
            });
    }
}

export const deleteAudioFile = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/file/deleteAudio/${id}`;

        axios
            .delete(url)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(getAllAudios());
            });
    }
}

export const updateAudio = (payload) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/file/updateAudio`;
        axios
            .put(url, payload)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));
                    dispatch(getAllAudios());
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setUploadAudioLoading(false));
            });

    }
}