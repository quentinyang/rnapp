'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Home';
import Immutable from 'immutable';

let initialState = {
    properties: [],
    pager: {
        'total': 1,
        'per_page': 10,
        'current_page': 1,
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
            let prependData = Immutable.fromJS(action.houseList);
            let newPrependData = state.updateIn(['properties'], (k) => {
                return prependData.get('properties').concat(k);
            });
            return newPrependData;
        default: 
            return state;
    }
}

export default combineReducers({
    houseData
});