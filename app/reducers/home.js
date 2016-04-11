'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Home';
import * as typesOne from '../constants/AttentionBlockSetOne';
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
            return Immutable.fromJS(action.houseList);
        case types.CLEAR_HOME_PAGE:
            return Immutable.fromJS(initialState);
            break;
        default: 
            return state;
    }
}


let initialAttentionList = {
    district_block_select: [],
    community_select: []
};

function attentionList(state = Immutable.fromJS(initialAttentionList), action) {
    switch(action.type) {
        case types.ATTENTION_BLOCK_COMMUNITY_FETCHED:
            return Immutable.fromJS(action.attentionList);
            break;
        case typesOne.ATTENTION_LIST_ONE_BLOCK_CHANGED:
            return state.updateIn(['district_block_select'], (v) => {
                return Immutable.fromJS(action.blockList)
            });
            break;
        case typesOne.ATTENTION_LIST_ONE_COMMUNITY_CHANGED:
            return state.updateIn(['community_select'], (v) => {
                return Immutable.fromJS(action.communityList)
            });
            break;
        case types.CLEAR_HOME_PAGE:
            return Immutable.fromJS(initialAttentionList);
            break;
        default: 
            return state;
    }
}

export default combineReducers({
    houseData,
    attentionList
});