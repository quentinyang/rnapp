'use strict';

import * as types from '../constants/App';
import {makeActionCreator} from './base';

export const webAuthentication = makeActionCreator(types.WEB_AUTHENTICATION, 'auth');

