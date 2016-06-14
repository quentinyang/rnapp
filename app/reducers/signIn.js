'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/SignIn';
import Immutable from 'immutable';

let initialState = {

};

function signIn(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.SIGN_INFO_FETCHED:
            return Immutable.fromJS(action.info);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    signIn
});