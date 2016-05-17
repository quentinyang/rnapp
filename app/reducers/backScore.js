'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/BackScore';
import Immutable from 'immutable';

let initialState = {
    visible: false
};

function pageData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.SUCCESS_MODAL_VISIBLE_CHANGE:
            return state.set('visible', action.visible);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    pageData
});