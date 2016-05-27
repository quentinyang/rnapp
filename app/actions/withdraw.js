'use strict';

import * as types from '../constants/Withdraw';
import {makeActionCreator, serviceAction} from './base';

export const priceChanged = makeActionCreator(types.PRICE_CHANGED, 'price');
export const priceCleared = makeActionCreator(types.PRICE_CLEARED);