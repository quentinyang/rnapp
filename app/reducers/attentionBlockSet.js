'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/AttentionBlockSet';
import Immutable from 'immutable';

let initialState = {
    district_block_list: [],
    district_block_select: [],
    district_block_select_temp: [],
};

function attentionBlockSet(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.ATTENTION_BLOCK_SET_FETCHED:
            action.blockSet.district_block_select_temp = action.blockSet.district_block_select;
            return Immutable.fromJS(action.blockSet);
            break;
        case types.ATTENTION_BLOCK_SET_ADDED:
            return state.updateIn(['district_block_select'], (k) => {
                return k.push(action.block)
            });
            break;
        case types.ATTENTION_BLOCK_SET_DELETED:
            return state.updateIn(['district_block_select'], (k) => {
                let newFilter = k.filter((v) => {
                    return action.block.get('id') != v.get('id')
                });
                return newFilter;
            })
            break;
        case types.ATTENTION_BLOCK_SET_CLEAR:
            let districtBlockSelectTemp = state.get('district_block_select_temp');

            return state.updateIn(['district_block_select'], (k) => {
                return districtBlockSelectTemp
            });
            break;
        default: 
            return state;
    }
}

let initialCity = {
    cityList: [],
    curCityId: ""
}

function cityInfo(state = Immutable.fromJS(initialCity), action) {
    switch(action.type) {
        case types.CITY_LIST_FETCHED:
            return state.set('cityList', Immutable.fromJS(action.list)).set('curCityId', Immutable.fromJS(action.list[0].id));
            break;
        case types.CUR_CITY_CHANGED:
            return state.set('curCityId', Immutable.fromJS(action.id));
            break;
        default:
            return state;
    }
}

export default combineReducers({
    attentionBlockSet,
    cityInfo
});