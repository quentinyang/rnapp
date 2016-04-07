'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/User';
import Immutable from 'immutable';

let initialState = {
    uid: 0,
    score: 0,
    contacted: 0,
    published: 0,
    portrait: ''
}

function userProfile(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.USER_PROFILE:
            return Immutable.fromJS(action.profile);
            break;
        default:
            return state;
            break
    }
}

export default combineReducers({
    userProfile
});