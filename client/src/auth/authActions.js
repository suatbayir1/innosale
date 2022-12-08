// Types
import { LOGIN, } from "./authTypes";

export const login = (payload) => {
    return {
        type: LOGIN,
        payload,
    }
}