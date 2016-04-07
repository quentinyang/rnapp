'use strict';

import * as types from '../constants/App';
import {makeActionCreator} from './base';

export const webAuthentication = makeActionCreator(types.WEB_AUTHENTICATION, 'auth');
export const webNetWorkError = makeActionCreator(types.WEB_NETWORK_ERROR, 'msg');

