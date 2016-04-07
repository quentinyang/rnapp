'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/App';
import Immutable from 'immutable';

let initialState = {
    auth: true
};

function appData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.WEB_AUTHENTICATION:
            return state.set('auth', action.auth);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    appData
});