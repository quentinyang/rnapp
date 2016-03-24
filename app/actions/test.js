'use strict';

import * as types from '../constants/TestTypes';
import {getPropertyList} from '../service/testService';

export function fetchTypes() {
    return dispatch => {
        return getPropertyList()
            .then((oData) => {
                dispatch(testLoading(true))
            })
            .catch((error) => {
                dispatch(testLoading(false))
            })
    }
}

function testLoading(loading) {
    return {
        type: types.TEST_LOADING,
        loading: loading
    }
}