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

let initialScores = {
    total: '...',
    properties: [],
    pager: {
        'total': 1,
        'per_page': 10,
        'current_page': 0,
        'last_page': 2,
    }
}

function scoreData(state = Immutable.fromJS(initialScores), action) {
    switch(action.type) {
        case types.SCORE_FETCHED:
            let currentScores = Immutable.fromJS(action.scores);
            let newScores = state.updateIn('properties', (k) => {
                return k.concat(currentScores.get('flows'));
            });
            return newScores.set('total', Immutable.fromJS(action.scores['total'])).set('pager', Immutable.fromJS(action.scores['pager']));
            break;
        default:
            return state;
    }
}

export default combineReducers({
    userProfile,
    scoreData
});