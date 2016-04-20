'use strict';

import {combineReducers} from 'redux';
import test from  './test';
import login from  './login';
import app from  './app';
import houseList from  './houseList';
import houseInput from  './houseInput';
import home from  './home';
import detail from  './detail';
import attentionBlockSet from  './attentionBlockSet';
import attentionBlockSetOne from  './attentionBlockSetOne';
import communitySearch from  './communitySearch';
import user from './user';
import settings from './settings';
import navigation from './navigation';

const rootReducer = combineReducers({
    test,
    login,
    app,
    houseList,
    houseInput,
    home,
    detail,
    attentionBlockSet,
    attentionBlockSetOne,
    communitySearch,
    user,
    settings,
});

export default rootReducer;