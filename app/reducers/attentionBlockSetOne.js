'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/AttentionBlockSetOne';
import Immutable from 'immutable';

let initialAttentionList = {
    district_block_select: [],
    community_select: []
};

function attentionList(state = Immutable.fromJS(initialAttentionList), action) {
    switch(action.type) {
        case types.ATTENTION_LIST_ONE_SET_FETCHED:
            return Immutable.fromJS(action.attentionList);
            break;
        case types.ATTENTION_LIST_ONE_BLOCK_CHANGED:
            return state.updateIn(['district_block_select'], (v) => {
                return Immutable.fromJS(action.blockList)
            });
            break;
        case types.ATTENTION_LIST_ONE_COMMUNITY_ROMOVED:
            return state.updateIn(['community_select'], (k) => {
                return k.filter((q) => {
                    return action.communityId != q.get('id')
                });
            });
            break;
        case types.ATTENTION_LIST_ONE_COMMUNITY_ADDED:
            return state.updateIn(['community_select'], (k) => {
                return k.push(Immutable.fromJS({
                    id: action.community.get('id'),
                    name: action.community.get('name')
                }));
            });
            break;
        default: 
            return state;
    }
}

export default combineReducers({
    attentionList
});