'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/CommunitySearch';
import Immutable from 'immutable';

let initialState = {
    results: [],
    keyword: ''
};

function communityData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.SETTING_SEARCH_HOUSE_FETCHED:
            return state.set('results', Immutable.fromJS(action.communityList));
            break;
        case types.SETTING_SEARCH_KEYWORD_CHANGED:
            return state.set('keyword', action.keyword);
            break;
        case types.SETTING_SEARCH_CLEARED:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    communityData
});