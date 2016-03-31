'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/AttentionBlockSet';
import Immutable from 'immutable';

let initialState = {
    district_block_list: [],
    district_block_select: []
};

function attentionBlockSet(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.ATTENTION_BLOCK_SET_FETCHED:
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
        default: 
            return state;
    }
}

export default combineReducers({
    attentionBlockSet
});