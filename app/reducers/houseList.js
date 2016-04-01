'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/HouseList';
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
        case types.HOUSE_FETCHED:
            return Immutable.fromJS(action.houseList);
            break;
        case types.HOUSE_APPEND_FETCHED:
            let immuData = Immutable.fromJS(action.houseList);
            let newData = state.updateIn(['properties'], (k) => {
                return k.concat(immuData.get('properties'));
            });
            newData = newData.set('pager', Immutable.fromJS(action.houseList['pager']));
            return newData;
            break;
        case types.HOUSE_PREPEND_FETCHED:
            return Immutable.fromJS(action.houseList);
            break;
        case types.HOUSE_LIST_PAGE_CLEARED:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    houseData
});