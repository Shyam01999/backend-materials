import {
  legacy_createStore,
  combineReducers,
  compose,
  applyMiddleware,
} from "redux";
import { thunk } from "redux-thunk";
import { userDetailsReducer } from "./reducers/auth.reducers";

// root reducer
const root_reducer = combineReducers({
  userDetailsReducer
});

//for redux devtool extension on chrome
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// store
export const store = legacy_createStore(
  root_reducer,
  composeEnhancers(applyMiddleware(thunk))
);