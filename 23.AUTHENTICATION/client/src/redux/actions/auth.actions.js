import api from "../../constants/api";
import { notifyError } from "../../constants/notification";
import { USER_DATA_FAILED, USER_DATA_LOADING, USER_DATA_SUCCESS, USER_LOGOUT_LOADING, USER_LOGOUT_SUCCESS, USER_LOGOUT_FAILED } from "../actionTypes";

export const userDetails = () => async (dispatch) => {
    try {
        dispatch({ type: USER_DATA_LOADING })
        const res = await api.get(`/api/v1/me`);

        if (res.data.success) {
            dispatch({ type: USER_DATA_SUCCESS, payload: res.data.data })
        }

    }
    catch (error) {
        console.log(error);
        dispatch({ type: USER_DATA_FAILED, payload: error.response.data.message });
    }
}


export const logoutUser = () => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGOUT_LOADING })
        const res = await api.post(`/api/v1/logout`, {}, { withCredentials: true });

        if (res.data.success) {
            dispatch({type: USER_LOGOUT_SUCCESS, payload:{
                data:res.data
            } })
        }
    }
    catch (error) {
        console.log("Error while logged out user", error);
        dispatch({ type: USER_LOGOUT_FAILED, })
    }
}