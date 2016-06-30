'use strict';

import { combineReducers } from 'redux';
import * as types from '../constants/Card';
import Immutable from 'immutable';

let initialState = {
    list: [],
    pager: {}
};

function welfareInfo(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.WELFARE_LIST_FETCHED:
            let newData = state.updateIn(['list'], (k) => {
                return k.concat(Immutable.fromJS(action.wfData.items));
            });
            return newData.set('pager', Immutable.fromJS(action.wfData.pager));
            break;
        default:
            return state;
    }
}

export default combineReducers({
    welfareInfo
});