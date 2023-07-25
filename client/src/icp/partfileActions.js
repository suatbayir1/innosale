// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

// Types
import { ALL_PARTS, PARTS, TABLE, CALCULATING, URL, FEATURES, CENTER, FILE_SPECS, FILE_LIST, TEKLIF_ID_LIST, PART_PROCESS_LIST } from "./partfileTypes";

// Actions
export const setParts = (payload) => {
    return {
        type: PARTS,
        payload,
    }
}

export const setAllParts = (payload) => {
    return {
        type: ALL_PARTS,
        payload,
    }
}

export const setCenter = (payload) => {
    return {
        type: CENTER,
        payload,
    }
}

export const setFeatures = (payload) => {
    return {
        type: FEATURES,
        payload,
    }
}

export const setCalculating = (payload) => {
    return {
        type: CALCULATING,
        payload,
    }
}

export const setTable = (payload) => {
    return {
        type: TABLE,
        payload,
    }
}

export const setURL = (payload) => {
    return {
        type: URL,
        payload,
    }
}

export const setFileSpecs = (payload) => {
    return {
        type: FILE_SPECS,
        payload,
    }
}

export const setFileList = (payload) => {
    return {
        type: FILE_LIST,
        payload,
    }
}

export const setTeklifId = (payload) => {
    return {
        type: TEKLIF_ID_LIST,
        payload,
    }
}

export const setPartProcessList = (payload) => {
    return {
        type: PART_PROCESS_LIST,
        payload,
    }
}


// Redux Thunk

export const getPartProcessList = () => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/three/part_process`;
        console.log(url);
        axios
            .get(url)
            .then(response => {
                dispatch(setPartProcessList(response.data.data));
                console.log(response)
            })
            .catch(err => {
                console.log(err)
                dispatch(setPartProcessList([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const getCenter = (filename) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/getcenter/${filename}`;

        console.log(url);

        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setCenter(response.data.data));
                }
            })
            .catch(err => {
                console.log(err)
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const getFileSpecs = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/three/file_loader`;
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setFileSpecs(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(setFileSpecs([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const getFileList = () => {
    return (dispatch) => {
        dispatch(setFileList([]));
        
        let url = `${process.env.REACT_APP_API_URL2}/three/get_file_list`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setFileList(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(setFileList([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const editPartInMongoDb = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/three/edit_part`;
        console.log(url);
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setFileSpecs(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(setFileSpecs([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const getTeklifId = () => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/three_file/get_teklif_ids`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setTeklifId(response.data.data));
                    console.log(response)
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(setTeklifId([]));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}


export const getAllParts = () => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/getall`;
        console.log(url);
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setAllParts(response.data.data));
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(setParts({
                    result: [],
                    count: 0
                }));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const getFilteredParts = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/getfilteredparts`;
        console.log(url);
        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setParts(response.data.data));
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(setParts({
                    result: [],
                    count: 0
                }));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const calculateTable = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/calculate`;
        console.log(url);

        setCalculating(1);
        
        axios
            .post(url, payload)
            /*.then((response) => {
                dispatch(setCalculating(1));
            })*/
            .then(response => {
                if (response.status === 200) {
                    dispatch(
                        setTable(response.data.data),
                    );
                }
            })
            /*.then((response) => {
                dispatch(setCalculating(2));
            })*/
            .catch(err => {
                console.log(err)
                dispatch(setTable({
                    result: [],
                    count: 0
                }));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setCalculating(2));
            });
        
            
    }
}

export const calculateTableFeatureBased = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/calculatefeatures`;
        console.log(url);
        
        setCalculating(1);

        axios
            .post(url, payload)
            /*.then((response) => {
                dispatch(setCalculating(1));
            })*/
            .then(response => {
                if (response.status === 200) {
                    dispatch(
                        setTable(response.data.data),
                    );
                }
            })
            /*.then((response) => {
                dispatch(setCalculating(2));
            })*/
            .catch(err => {
                console.log(err)
                dispatch(setTable({
                    result: [],
                    count: 0
                }));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setCalculating(2));
            });
        
            
    }
}

export const calculateTableHybrid = (payload) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/calculatehybrid`;
        console.log(url);
        
        setCalculating(1);

        axios
            .post(url, payload)
            /*.then((response) => {
                dispatch(setCalculating(1));
            })*/
            .then(response => {
                if (response.status === 200) {
                    dispatch(
                        setTable(response.data.data),
                    );
                }
            })
            /*.then((response) => {
                dispatch(setCalculating(2));
            })*/
            .catch(err => {
                console.log(err)
                dispatch(setTable({
                    result: [],
                    count: 0
                }));
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            .finally(() => {
                dispatch(setCalculating(2));
            });  
    }
}


export const getURL = (id) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/geturl/${id}`;

        console.log(url);

        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setURL(response.data.data.url));
                }
            })
            .catch(err => {
                console.log(err)
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}


export const getFeatures = (filename) => {
    return (dispatch) => {
        let url = `${process.env.REACT_APP_API_URL2}/parts/getfeatures/${filename}`;
    
        console.log(url);

        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    dispatch(setFeatures(response.data.data));
                }
            })
            .catch(err => {
                console.log(err)
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
            
    }
}