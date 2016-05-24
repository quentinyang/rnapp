'use strict';

import * as types from '../constants/Navigation';
import {makeActionCreator} from './base';

export const listPushRoute = makeActionCreator(types.LIST_PUSH_ROUTE);
export const detailPushRoute = makeActionCreator(types.DETAIL_PUSH_ROUTE);

export const listPopRoute = makeActionCreator(types.LIST_POP_ROUTE, 'states');
export const detailPopRoute = makeActionCreator(types.DETAIL_POP_ROUTE, 'states');

export const setContactStatus = makeActionCreator(types.SET_CONTACT_STATUS, 'contactStatus'); //{property_id: 1,  is_contact: "1"}
export const setLookStatus = makeActionCreator(types.SET_LOOK_STATUS, 'lookStatus'); //{property_id: 1,  is_click: "1"}