'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/User';
import Immutable from 'immutable';
import navigation from './navigation';

let initialState = {
    uid: 0,
    score: 0,
    contacted: 0,
    published: 0,
    portrait: '',
    sign_in_days: '',
    go_on_sign_in_day: '',
    is_signed_in: "1", //今天是否签到过：按钮是否显示
}

function userProfile(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.USER_PROFILE:
            return Immutable.fromJS(action.profile);
            break;
        case types.SIGN_IN_BUTTON_VISIBLE_CHANGED:
            return state.set('is_signed_in', Immutable.fromJS(action.visible));
            break;
        case types.SIGN_IN_DAYS_CHANGED:
            state = state.set('sign_in_days', Immutable.fromJS(action.days));
            return state.set('go_on_sign_in_day', Immutable.fromJS(action.goOnDays));
            break;
        default:
            return state;
            break
    }
}

let controlState = {
    visible: false
};

function userControlData(state = Immutable.fromJS(controlState), action) {
    switch(action.type) {
        case types.BIND_VISIBLE_CHANGED:
            return state.set('visible', action.visible);
            break;
        default:
            return state;
    }
}

let initialScores = {
    money: '',
    flows: [],
    pager: {
        'total': 1,
        'per_page': 10,
        'current_page': 0,
        'last_page': 2,
    }
}

function scoreData(state = Immutable.fromJS(initialScores), action) {
    switch(action.type) {
        case types.SCORE_LIST:
            let currentScores = Immutable.fromJS(action.scores);
            let newScores = state.updateIn(['flows'], (k) => {
                return k.concat(currentScores.get('flows'));
            });
            return newScores.set('money', Immutable.fromJS(action.scores['money'])).set('pager', Immutable.fromJS(action.scores['pager']));
            break;
        case types.SCORE_CLEARED:
            return Immutable.fromJS(initialScores);
            break;
        default:
            return state;
    }
}

function expLevel(state = Immutable.fromJS([]), action) {
    switch(action.type) {
        case types.EXP_RULE:
            return Immutable.fromJS(action.expRule);
        default:
            return state;
    }
}

let initUserInputHouse = {
    properties: [],
    pager: {}
};

function userHouseData(state = Immutable.fromJS(initUserInputHouse), action) {
    switch(action.type) {
        case types.USER_INPUT_HOUSE_FETCHED:
            let newData = state.updateIn(['properties'], (k) => {
                return k.concat(Immutable.fromJS(action.data.properties));
            });
            return newData.set('pager', Immutable.fromJS(action.data.pager));
            break;
        case types.USER_INPUT_HOUSE_CLEARED:
            return Immutable.fromJS(initUserInputHouse);
            break;
        default:
            return state;
    }
}

let initSignIn = {
    visible: false,
    sign_in_result: {
        "sign_in_days":  1, // 签到天数
        "experience":  3, // 经验
        "welfare_cards": [] // 福利卡，如果多张则多个数据
    }
}

function signInInfo(state = Immutable.fromJS(initSignIn), action) {
    switch(action.type) {
        case types.SIGN_IN_FETCHED:
            return state.set('sign_in_result', Immutable.fromJS(action.info));
            break;
        case types.SIGN_IN_VISIBLE_CHANGED:
            return state.set('visible', Immutable.fromJS(action.visible));
        default:
            return state;
            break;
    }
}

export default combineReducers({
    userProfile,
    userControlData,
    scoreData,
    expLevel,
    signInInfo,
    userHouseData: navigation(userHouseData, Immutable.fromJS(initUserInputHouse), 'aboutUser')
});