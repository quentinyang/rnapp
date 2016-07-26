'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/SettingsType';
import Immutable from 'immutable';

let initialState = {
    contactHouse: {
        properties: [],
        pager: {
            'per_page': 10,
            'current_page': 0,
            'last_page': 2,
        },
        timeVisible: false
    },
    inputHouse: {
        properties: [],
        pager: {
            'per_page': 10,
            'current_page': 0,
            'last_page': 2,
        }
    }
};

function houseData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.CONTACT_HOUSE_FETCHED:
            let immuContactData = Immutable.fromJS(action.contactHouse);
            let newContactData = state.updateIn(['contactHouse', 'properties'], (k) => {
                return k.concat(immuContactData.get('properties'));
            });
            newContactData = newContactData.setIn(['contactHouse', 'pager'], Immutable.fromJS(action.contactHouse['pager']));
            return newContactData;
            break;
        case types.INPUT_HOUSE_FETCHED:
            let immuInputData = Immutable.fromJS(action.inputHouse);
            let newInputData = state.updateIn(['inputHouse', 'properties'], (k) => {
                return k.concat(immuInputData.get('properties'));
            });
            newInputData = newInputData.setIn(['inputHouse', 'pager'], Immutable.fromJS(action.inputHouse['pager']));
            return newInputData;
            break;
        case types.CONTACT_HOUSE_PREPEND_FETCHED:
            return state.set('contactHouse', Immutable.fromJS(action.contactHouse));
            break;
        case types.INPUT_HOUSE_PREPEND_FETCHED:
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