'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/SignIn';
import Immutable from 'immutable';

let initialState = {
    "have_not_get_points": [],
    "have_been_get_points": []
};

function signIn(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.SIGN_INFO_FETCHED:
            return Immutable.fromJS(action.info);
            break;
        case types.CLEAN_SIGN_INFO:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    signIn
});