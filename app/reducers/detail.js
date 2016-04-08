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
            return Immutable.fromJS(action.houseList);
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
        case types.CLEAR_HOUSE_BASE:
            return Immutable.fromJS(initialBaseInfo);
            break;
        default:
            return state;
    }
}

let initParam = {
    scoreTipVisible: true,
    callError: {},
    errorTipVisible: false,
    feedbackVisible: false,
    sellerPhone: '',
    washId: ''
};

function callInfo(state = Immutable.fromJS(initParam), action) {
    switch(action.type) {
        case types.SCORE_TIP_VISIBLE_CHANGED:
            return state.set('scoreTipVisible', Immutable.fromJS(action.visible));
            break;
        case types.ERROR_TIP_VISIBLE_CHANGED:
            return state.set('errorTipVisible', Immutable.fromJS(action.visible));
            break;
        case types.FEEDBACK_VISIBLE_CHANGED:
            return state.set('feedbackVisible', Immutable.fromJS(action.visible));
            break;
        case types.CALL_SELLER_SUCCESS:
            return state.set('washId', Immutable.fromJS(action.logId));
            break;
        case types.SET_SELLER_PHONE:
            return state.set('sellerPhone', Immutable.fromJS(action.phone));
            break;
        case types.CALL_SELLER_FAILED:
            return state.set('callError', Immutable.fromJS(action.callError));
            break;
        case types.CLEAR_CALL_INFO:
            return Immutable.fromJS(initParam);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    houseData,
    baseInfo,
    callInfo
});
