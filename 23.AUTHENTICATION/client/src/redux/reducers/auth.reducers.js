import { USER_DATA_FAILED, USER_DATA_LOADING, USER_DATA_SUCCESS, USER_LOGOUT_FAILED, USER_LOGOUT_LOADING, USER_LOGOUT_SUCCESS } from "../actionTypes/index"

const initialState = {
    loading: false,
    userData: {},
    isAuth: false,
    error: '',

    logoutloading: false,
    logouterror: '',

}

export const userDetailsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case USER_DATA_LOADING:
            return {
                ...state,
                loading: true
            };

        case USER_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                userData: payload,
                isAuth: true
            };

        case USER_DATA_FAILED:
            return {
                ...state,
                loading: false,
                error: payload
            };

        case USER_LOGOUT_LOADING:
            return {
                ...state,
                logoutloading: true
            };

        case USER_LOGOUT_SUCCESS:
            return {
                ...state,
                logoutloading: false,
                userData: {},
                isAuth: false,
            };

        case USER_LOGOUT_FAILED:
            return {
                ...state,
                logoutloading: false,
                logouterror: 'Something went wrong while logout.',
            };

        default:
            return state
    }
}