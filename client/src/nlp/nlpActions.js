// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { UPLOAD_AUDIO_LOADING, SET_AUDIOS, SUMMARIZE_SETTINGS, SUMMARIZE_RESULT, ENTITY_LIST, SELECTED_SETTING, INSERTED_ID, SAMPLE_SUMMARIZE_RESULT, TRANSCRIBE_RESULTS, QUEUE_TABLE, HASH } from "./nlpTypes";

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

export const setSampleSummarize = (payload) => {
    return {
        type: SAMPLE_SUMMARIZE_RESULT,
        payload,
    }
}

export const setSummarizeResult = (payload) => {
    return {
        type: SUMMARIZE_RESULT,
        payload,
    }
}

export const setEntities = (payload) => {
    return {
        type: ENTITY_LIST,
        payload,
    }
}

export const setSetting = (payload) => {
    return {
        type: SELECTED_SETTING,
        payload,
    }
}

export const setInsertedId = (payload) => {
    return {
        type: INSERTED_ID,
        payload
    }
}

export const setTransribeResults = (payload) => {
    return {
        type: TRANSCRIBE_RESULTS,
        payload
    }
}

export const setQueueTable = (payload) => {
    return {
        type: QUEUE_TABLE,
        payload
    }
}

export const setHash = (payload) => {
    return {
        type: HASH,
        payload
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

export const getAudiosByOfferId = (id) => {
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/file/getAudiosByOfferId/${id}`;
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
    console.log(window.location.pathname.split("/").length);
    return (dispatch, getState) => {
        let url = `${process.env.REACT_APP_API_URL}/file/uploadAudio`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.message, 'Successfull', 3000);
                    dispatch(setOverlay('none'));

                    // If url exist param fetch audios by offerId
                    if (window.location.pathname.split("/").length === 3) {
                        dispatch(getAudiosByOfferId(window.location.pathname.split("/")[2]));
                    } else {
                        dispatch(getAllAudios());
                    }
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

                    // If url exist param fetch audios by offerId
                    if (window.location.pathname.split("/").length === 3) {
                        dispatch(getAudiosByOfferId(window.location.pathname.split("/")[2]));
                    } else {
                        dispatch(getAllAudios());
                    }
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
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/db_insert_settings`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
                dispatch(setSummarizeSettings(response.data.data))
            })
            .catch(err => {
                console.log(err);
                dispatch(setInsertedId(""))
            })
    }
}

export const updateSettings = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/db_update_settings`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
                dispatch(setSummarizeSettings(response.data.data))
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getAllSettings = () => {
    return (dispatch) => {
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

export const getSummarize = (payload) => {

    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/summarize`
        axios
            .post(url, payload)
            .then(response => {
                dispatch(setSummarizeResult(response.data.data))
                console.log(response)
            })
            .catch(err => {
                dispatch(setSummarizeResult())
                console.log(err);
            })
    }
}

export const getEntities = () => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/get_all_entities`
        axios
            .get(url)
            .then(response => {
                dispatch(setEntities(response.data.data.entities))
                console.log(response)
            })
            .catch(err => {
                dispatch(setEntities([]))
                console.log(err);
            })
    }
}

export const getSetting = (payload) => {

    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/db_get_setting`
        axios
            .post(url, payload)
            .then(response => {
                dispatch(setSetting(response.data.data[0]))
                console.log(response)
            })
            .catch(err => {
                dispatch(setSetting())
                console.log(err);
            })
    }
}

export const removeSetting = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/db_delete_settings`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
                dispatch(setSummarizeSettings(response.data.data))
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const sampleSummarize = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/spacy/sample_summarize`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response)
                dispatch(setSampleSummarize(response.data.data))
            })
            .catch(err => {
                console.log(err);
            })
    }

}

export const getTransribeResults = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/hugging/get_transcribe_results`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response.data.data)
                dispatch(setTransribeResults(response.data.data))
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export const editTranscribeResult = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/hugging/edit_transcribe_result`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response.data.data)
                dispatch(setTransribeResults(response.data.data))
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export const getQueueTable = () => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/hugging/get_queue_table`
        axios
            .get(url)
            .then(response => {
                console.log(response.data)
                dispatch(setQueueTable(response.data.data))
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export const getHash = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/hugging/get_hash`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response.data.data)
                dispatch(setHash(response.data.data))
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export const addTranscribeQueue = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/hugging/add_to_queue`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response.data.data)
                dispatch(setQueueTable(response.data.data))
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export const deleteFromTranscribeQueue = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_BASE_SERVER_URL1}/api/v1/hugging/delete_from_queue`
        axios
            .post(url, payload)
            .then(response => {
                console.log(response.data.data)
                dispatch(setQueueTable(response.data.data))
            })
            .catch(error => {
                console.log(error)
            })
    }
}

