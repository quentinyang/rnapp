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

export default combineReducers({
    userProfile,
    userControlData,
    scoreData,
    expLevel,
    userHouseData
});