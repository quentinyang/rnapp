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

export default combineReducers({
    houseData
});