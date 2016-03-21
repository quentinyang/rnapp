'use strict';

import * as types from '../constants/TestTypes';
import Immutable from 'immutable';

let initialState = Immutable.fromJS({
    'loading': false
});

export default function test(state = initialState, action) {
    switch (action.type) {
        case types.TEST_LOADING:
            return state.set('loading', action.loading);
        default:
            return state;
    }
}
