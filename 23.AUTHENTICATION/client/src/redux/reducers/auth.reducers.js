import { USER_DATA_FAILED, USER_DATA_LOADING, USER_DATA_SUCCESS } from "../actionTypes"

const initialState = {
loading:false,
userData:{},
isAuth:false,
error:'',
}

export const userDetailsReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case USER_DATA_LOADING:
         return {
            ...state,
            loading:true
         };

        case USER_DATA_SUCCESS:
        return {
            ...state,
            loading:false,
            userData:payload,
            isAuth:true
        };

        case USER_DATA_FAILED:
            return{
                ...state,
                loading:false,
                error:payload
            };

        default:
         return state
    }
}