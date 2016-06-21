'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/DetailType';
import * as homeTypes from '../constants/Home';
import * as appTypes from '../constants/App';
import Immutable from 'immutable';
import navigation from './navigation';

let initialState = {
    properties: []
};

function houseData(state, action) {
    switch(action.type) {
        case types.HOUSE_SIMILAR_FETCHED:
            return Immutable.fromJS(action.houseList);
            break;
        case types.CLEAR_HOUSE_DETAIL_PAGE:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

let initialBaseInfo = {
    baseInfo: {},

    curLogs: [],
    contact: {
        logs: [],
        pager: {},
        total: ""
    }
};

function baseInfo(state, action) {
    switch(action.type) {
        case types.HOUSE_BASE_FETCHED:
            return state.set('baseInfo', Immutable.fromJS(action.houseBase));
            break;
        case types.CLEAR_HOUSE_DETAIL_PAGE:
            return Immutable.fromJS(initialBaseInfo);
            break;
        case types.APPEND_HOUSE_CONTACT_LOG:
            state = state.updateIn(['contact', 'logs'], (k) => {
                return k.concat(Immutable.fromJS(action.contact.logs));
            });
            return state.setIn(['contact', 'pager'], Immutable.fromJS(action.contact.pager));
            break;
        case types.HOSUE_CONTACT_LOG:
            let newState = state.set('contact', Immutable.fromJS(action.contact));
            let curTemp = Immutable.List();
            newState = newState.updateIn(['contact', 'logs'], (k) => {
                curTemp = k.slice(0, 5);
                return k.splice(0, 5);
            });
            return newState.set('curLogs', curTemp);
            break;
        case types.CHANGE_CURRENT_CONTACT_LOG:
            let temp = Immutable.List();
            state = state.updateIn(['contact', 'logs'], (k) => {
                temp = k.slice(0, 5);
                return k.splice(0, 5);
            });
            return state.updateIn(['curLogs'], (k) => {
                return k.concat(temp);
            });
            break;
        default:
            return state;
    }
}

let initParam = {
    callError: {
        msg: '拨打电话失败了,再试一下吧!'
    },
    errorTipVisible: false,
    feedbackVisible: false,
    sellerPhone: '',
    washId: ''
};

function callInfo(state, action) {
    switch(action.type) {
        case types.ERROR_TIP_VISIBLE_CHANGED:
            return state.set('errorTipVisible', Immutable.fromJS(action.visible));
            break;
        case types.FEEDBACK_VISIBLE_CHANGED:
            return state.set('feedbackVisible', Immutable.fromJS(action.visible));
            break;
        case types.SET_SELLER_PHONE:
            return state.set('sellerPhone', Immutable.fromJS(action.phone));
            break;
        case types.CALL_SELLER_FAILED:
            return state.set('callError', Immutable.fromJS(action.callError));
            break;
        case types.CLEAR_HOUSE_DETAIL_PAGE:
            return Immutable.fromJS(initParam);
            break;
        case types.SET_WASH_ID:
            return state.set('washId', Immutable.fromJS(action.washId));
            break;
        case appTypes.CLICK_BACK_PAGE:
            if(action.pageName == "backScore") {
                return state.set('feedbackVisible', Immutable.fromJS(true));
            }
            return state;
            break;
        default:
            return state;
    }
}

let base = {
    houseData: Immutable.fromJS(initialState),
    baseInfo: Immutable.fromJS(initialBaseInfo),
    callInfo: Immutable.fromJS(initParam)
};

function houseDetail(state, action) {
    return {
        houseData: houseData(state.houseData, action),
        baseInfo: baseInfo(state.baseInfo, action),
        callInfo: callInfo(state.callInfo, action)
    };
}

export default navigation(houseDetail, base, 'houseDetail');
