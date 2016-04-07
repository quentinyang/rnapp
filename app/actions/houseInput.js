import * as types from '../constants/HouseInput';
import {inputHouseService} from '../service/houseInputService';
import {makeActionCreator} from './base';

export const communityChanged = makeActionCreator(types.COMMUNITY_CHANGED, 'community');
export const buildingChanged = makeActionCreator(types.BUILDING_CHANGED, 'building_num');
export const unitChanged = makeActionCreator(types.UNIT_CHANGED, 'unit_num');
export const doorChanged = makeActionCreator(types.DOOR_CHANGED, 'door_num');
export const bedroomsChanged = makeActionCreator(types.BEDROOMS_CHANGED, 'bedrooms');
export const livingroomsChanged = makeActionCreator(types.LIVINGROOMS_CHANGED, 'living_rooms');
export const bathroomsChanged = makeActionCreator(types.BATHROOMS_CHANGED, 'bathrooms');
export const areaChanged = makeActionCreator(types.AREA_CHANGED, 'area');
export const priceChanged = makeActionCreator(types.PRICE_CHANGED, 'price');

export const aliasChanged = makeActionCreator(types.ALIAS_CHANGED, 'seller_alias');
export const phoneChanged = makeActionCreator(types.PHONE_CHANGED, 'seller_phone');

export const searchChanged = makeActionCreator(types.SEARCH_CHANGED, 'search');
export const singleChanged = makeActionCreator(types.SINGLE_CHANGED, 'single');
export const noUnit = makeActionCreator(types.NO_UNIT_CHANGED, 'no_unit');
export const villaChanged = makeActionCreator(types.VILLA_CHANGED, 'villa');
export const error = makeActionCreator(types.ERR_MSG, 'err_msg');

export function houseSubmit(params) {
    return dispatch => {
        return inputHouseService({body:params})
            .then((oData) => {
                console.info('Ajax Success: ', oData);
            })
            .catch((error) => {
                console.log('Ajax Error: ', error);
            })
    }
}
