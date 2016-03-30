'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/searchDemo';
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

function searchData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.SEARCH_HOUSE_FETCHED:
            return Immutable.fromJS(action.houseList);
            break;
            case types.CLEAR_FETCHED:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    searchData
});
