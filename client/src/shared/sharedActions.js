// Types
import { SET_OVERLAY, SET_DIALOG_DATA } from "./sharedTypes";

export const setOverlay = (payload) => {
    return {
        type: SET_OVERLAY,
        payload,
    }
}

export const setDialogData = (payload) => {
    return {
        type: SET_DIALOG_DATA,
        payload,
    }
}