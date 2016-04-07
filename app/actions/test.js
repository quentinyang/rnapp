'use strict';

import * as types from '../constants/TestTypes';
import {getPropertyList} from '../service/testService';
import {makeActionCreator, serviceAction} from './base';

export function fetchTypes() {
    return dispatch => {
        serviceAction(dispatch)({
            service: getPropertyList,
            success: function(oData) {
                dispatch(testLoading(true))
            },
            error: function(oData) {
                dispatch(testLoading(false))
            }
        })
    }
}

function testLoading(loading) {
    return {
        type: types.TEST_LOADING,
        loading: loading
    }
}