'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/DetailType';
import Immutable from 'immutable';

let initialState = {
    properties: []
};

function houseData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.HOUSE_SIMILAR_FETCHED:
            return state.set('properties', Immutable.fromJS(action.houseList));
            break;
        default: 
            return state;
    }
}

let initialBaseInfo = {
    baseInfo: {},
    status: []
};

function baseInfo(state = Immutable.fromJS(initialBaseInfo), action) {
    switch(action.type) {
        case types.HOUSE_BASE_FETCHED:
            return state.set('baseInfo', Immutable.fromJS(action.houseBase));
            break;
        case types.HOUSE_STATUS_FETCHED:
            return state.set('status', Immutable.fromJS(action.houseStatus));
            break;
        default:
            return state;
    }
}

export default combineReducers({
    houseData,
    baseInfo
});
