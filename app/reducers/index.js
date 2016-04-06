'use strict';

import {combineReducers} from 'redux';
import test from  './test';
import login from  './login';
import houseList from  './houseList';
import houseInput from  './houseInput';
import home from  './home';
import detail from  './detail';
import attentionBlockSet from  './attentionBlockSet';
import attentionBlockSetOne from  './attentionBlockSetOne';
import communitySearch from  './communitySearch';

const rootReducer = combineReducers({
    test,
    login,
    houseList,
    houseInput,
    home,
    detail,
    attentionBlockSet,
    attentionBlockSetOne,
    communitySearch
});

export default rootReducer;