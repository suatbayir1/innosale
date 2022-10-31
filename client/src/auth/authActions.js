// Types
import { LOGIN, } from "./authTypes";

export const login = (payload) => {
    console.log(payload)
    return {
        type: LOGIN,
        payload,
    }
}