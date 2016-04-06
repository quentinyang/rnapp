import * as types from '../constants/HouseInput';
import {houseInput} from '../service/houseInputService';
import {makeActionCreator} from './base';

export const buildingChanged = makeActionCreator(types.BUILDING_CHANGED, 'building_num');
export const unitChanged = makeActionCreator(types.UNIT_CHANGED, 'unit_num');
export const doorChanged = makeActionCreator(types.DOOR_CHANGED, 'door_num');
export const areaChanged = makeActionCreator(types.AREA_CHANGED, 'area');
export const priceChanged = makeActionCreator(types.PRICE_CHANGED, 'price');

export const aliasChanged = makeActionCreator(types.ALIAS_CHANGED, 'seller_alias');
export const phoneChanged = makeActionCreator(types.PHONE_CHANGED, 'seller_phone');

export const error = makeActionCreator(types.ERR_MSG, 'err_msg');
