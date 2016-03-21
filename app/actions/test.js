'use strict';

import * as types from '../constants/TestTypes';

export function fetchTypes(loading) {
    return {
        type: types.TEST_LOADING,
        loading: loading
    }
}