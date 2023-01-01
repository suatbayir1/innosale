// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { UPLOAD_AUDIO_LOADING, SET_AUDIOS, SUMMARIZE_SETTINGS } from "./nlpTypes";

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

export const setSummarizeSettings = (payload) => {
    return {
        type: SUMMARIZE_SETTINGS,
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

export const saveSettings = (payload) => {
    return () => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/db_insert_settings`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const updateSettings = (payload) => {
    return () => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/db_update_settings`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getAllSettings = () => {
    return (dispatch) => {
        const results = [];
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/db_get_all_settings`
        axios
            .get(url)
            .then(response => {
                dispatch(setSummarizeSettings(response.data.data))
                console.log(response)
            })
            .catch(err => {
                dispatch(setSummarizeSettings([]))
                console.log(err);
            })
    }
}