// Types
import { SET_OVERLAY } from "./sharedTypes";

export const setOverlay = (payload) => {
    console.log(payload)
    return {
        type: SET_OVERLAY,
        payload,
    }
}