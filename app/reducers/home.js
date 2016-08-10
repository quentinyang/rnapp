'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Home';
import * as typesOne from '../constants/AttentionBlockSetOne';
import Immutable from 'immutable';

let initialState = {
    properties: [],
    pager: {
        'total': '',
        'per_page': 10,
        'current_page': 0,
        'last_page': 2,
    }
};

function houseData(state = Immutable.fromJS(initialState), action) {
    switch (action.type) {
        case types.HOUSE_ATTENTION_FETCHED:
            return Immutable.fromJS(action.houseList);
            break;
        case types.HOUSE_ATTENTION_APPEND_FETCHED:
            let immuData = Immutable.fromJS(action.houseList);
            let newData = state.updateIn(['properties'], (k) => {
                return k.concat(immuData.get('properties'));
            });
            newData = newData.set('pager', Immutable.fromJS(action.houseList['pager']));

            return newData;
            break;
        case types.HOUSE_ATTENTION_PREPEND_FETCHED:
            return Immutable.fromJS(action.houseList);
        case types.CLEAR_HOME_PAGE:
            return Immutable.fromJS(initialState);
            break;

        case types.SET_CONTACT_STATUS:
            return state.updateIn(['properties'], (k) => {
                let newArr = Immutable.List();
                k.forEach((val, key) => {
                    if (val.get('property_id') == action.contactStatus.property_id) {
                        let newVal = val.set('is_contact', Immutable.fromJS(true));
                        newArr = newArr.push(newVal);
                    } else {
                        newArr = newArr.push(val);
                    }
                });
                return newArr;
            });
            break;
        case types.SET_LOOK_STATUS:
            return state.updateIn(['properties'], (k) => {
                let newArr = Immutable.List();
                k.forEach((val, key) => {
                    if (val.get('property_id') == action.lookStatus.property_id) {
                        let newVal = val.set('is_click', Immutable.fromJS(true));
                        newArr = newArr.push(newVal);
                    } else {
                        newArr = newArr.push(val);
                    }
                });
                return newArr;
            });
            break;
        default:
            return state;
    }
}

let initialAttentionList = {
    district_block_select: [],
    community_select: []
};

function attentionList(state = Immutable.fromJS(initialAttentionList), action) {
    switch (action.type) {
        case types.ATTENTION_BLOCK_COMMUNITY_FETCHED:
            return Immutable.fromJS(action.attentionList);
            break;
        case typesOne.ATTENTION_LIST_ONE_BLOCK_CHANGED:
            return state.updateIn(['district_block_select'], (v) => {
                return Immutable.fromJS(action.blockList)
            });
            break;
        case typesOne.ATTENTION_LIST_ONE_COMMUNITY_CHANGED:
            return state.updateIn(['community_select'], (v) => {
                return Immutable.fromJS(action.communityList)
            });
            break;
        case types.CLEAR_HOME_PAGE:
            return Immutable.fromJS(initialAttentionList);
            break;
        default:
            return state;
    }
}

let initialBaseInfo = {
    newCount: "",

    currentModal: '',
    modals: [],

    scoreModal: {       //注册送福利卡
        fetched: false,
        visible: false,
        welfareArr: []
    },

    couponModal: {        //打开App送福利卡
        fetched: false,
        visible: false,
        welfareArr: []
    },

    ruleModal: {
        "input_points": 7, //发房积分
        "looked_points": 2 //房源被查看
    },
};

function baseInfo(state = Immutable.fromJS(initialBaseInfo), action) {
    switch (action.type) {
        case types.CURRENT_MODAL_CHANGED:
            let modalChanged = state.set('currentModal', Immutable.fromJS(action.modal));
            return modalChanged.update('modals', (k) => {
                return k.filter(m => {
                    return m !== action.modal;
                });
            });
            break;
        case types.PUSH_SHOW_MODAL:
            return state.update('modals', (k) => {
                return k.push(Immutable.fromJS(action.modal));
            });
            break;
        case types.SCORE_MODAL_STATUS:
            return state.set('scoreModal', Immutable.fromJS(action.status));
            break;

        case types.COUPON_MODAL_STATUS:
            return state.set('couponModal', Immutable.fromJS(action.status));
            break;

        case types.RULE_MODAL_STATUS:
            return state.set('ruleModal', Immutable.fromJS(action.status));
            break;

        case types.HOUSE_NEW_COUNT:
            return state.set('newCount', Immutable.fromJS(action.count));
            break;
        case types.CLEAR_HOME_PAGE:
            return Immutable.fromJS(initialBaseInfo);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    houseData,
    attentionList,
    baseInfo
});