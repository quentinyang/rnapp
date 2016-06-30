'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Home';
import * as typesOne from '../constants/AttentionBlockSetOne';
import Immutable from 'immutable';

let initialState = {
    properties: [],
    pager: {
        'total': 1,
        'per_page': 10,
        'current_page': 0,
        'last_page': 2,
    }
};

function houseData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
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
                    if(val.get('property_id') == action.contactStatus.property_id) {
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
                    if(val.get('property_id') == action.lookStatus.property_id) {
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
    switch(action.type) {
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

    scoreVisible: true,
    scoreModal: {
        visible: false,
        score: 8
    },

    couponVisible: false,
    couponModal: {
        visible: false,
        score: 1
    },

    ruleVisible: false,
    ruleModal: {
        visible: false,
        score: 8
    },

    giftVisible: false,
    giftCanShow: false,
    giftModal: {
        "sign_in_days": "1",
        "experience": "0"
    }
};

function baseInfo(state = Immutable.fromJS(initialBaseInfo), action) {
    switch (action.type) {
        case types.SCORE_MODAL_VISIBLE_CHANGED:
            return state.set('scoreVisible', Immutable.fromJS(action.visible));
            break;
        case types.SCORE_MODAL_STATUS:
            return state.set('scoreModal', Immutable.fromJS(action.status));
            break;
        case types.COUPON_MODAL_VISIBLE_CHANGED:
            return state.set('couponVisible', Immutable.fromJS(action.visible));
            break;
        case types.COUPON_MODAL_STATUS:
        console.dir(action.status);
            return state.set('couponModal', Immutable.fromJS(action.status));
            break;
        case types.RULE_MODAL_VISIBLE_CHANGED:
            return state.set('ruleVisible', Immutable.fromJS(action.visible));
            break;
        case types.RULE_MODAL_STATUS:
            return state.set('ruleModal', Immutable.fromJS(action.status));
            break;
        case types.GIFT_MODAL_VISIBLE_CHANGED:
            return state.set('giftVisible', Immutable.fromJS(action.visible));
            break;
        case types.GIFT_MODAL_STATUS:
            return state.set('giftModal', Immutable.fromJS(action.status));
            break;
        case types.GIFT_MODAL_SHOW:
            return state.set('giftCanShow', Immutable.fromJS(action.visible));
            break;

        case types.HOUSE_NEW_COUNT:
            return state.set('newCount', Immutable.fromJS(action.count));
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