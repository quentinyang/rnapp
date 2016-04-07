'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/SettingsType';
import Immutable from 'immutable';

let initialState = {
    contactHouse: {
        properties: [],
        pager: {
            'total': 1,
            'per_page': 10,
            'current_page': 0,
            'last_page': 2,
        }
    },
    inputHouse: {
        properties: [],
        pager: {
            'total': 1,
            'per_page': 10,
            'current_page': 0,
            'last_page': 2,
        }
    }
};

function houseData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.CONTACT_HOUSE_FETCHED:
            return state.set('contactHouse', Immutable.fromJS(action.contactHouse));
            break;
        case types.INPUT_HOUSE_FETCHED:
            return state.set('inputHouse', Immutable.fromJS(action.inputHouse));
            break;
        case types.HOUSE_DATA_CLEARED:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    houseData
});