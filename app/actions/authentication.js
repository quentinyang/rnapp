'use strict';

import * as types from '../constants/Authentication';
import {makeActionCreator, serviceAction} from './base';

export const realNameChanged = makeActionCreator(types.REAL_NAME_CHANGED, 'name');
export const IDCardNumChanged = makeActionCreator(types.ID_CARD_NUM_CHANGED, 'identity_card_number');
export const workAddrChanged = makeActionCreator(types.WORK_ADDRESS_CHANGED, 'data');
export const businessCardChanged = makeActionCreator(types.BUSINESS_CARD_CHANGED, 'business_card_id');
export const identityCardChanged = makeActionCreator(types.IDENTITY_CARD_CHANGED, 'identity_card_id');
export const addrPickerChanged = makeActionCreator(types.ADDR_PICKER_CHANGED, 'visible');

