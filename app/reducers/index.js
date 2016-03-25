'use strict';

import {combineReducers} from 'redux';
import test from  './test';
import login from  './login';

const rootReducer = combineReducers({
    test,
    login
})

export default rootReducer;