import * as types from '../constants/HouseInput';
import {inputHouseService} from '../service/houseInputService';
import {fetchCommunityListService} from '../service/communityService';
import {makeActionCreator, serviceAction} from './base';

export const communityChanged = makeActionCreator(types.COMMUNITY_CHANGED, 'community');
export const buildingChanged = makeActionCreator(types.BUILDING_CHANGED, 'building_num');
export const unitChanged = makeActionCreator(types.UNIT_CHANGED, 'unit_num');
export const doorChanged = makeActionCreator(types.DOOR_CHANGED, 'door_num');
export const floorChanged = makeActionCreator(types.FLOOR_CHANGED, 'floor');
export const bedroomsChanged = makeActionCreator(types.BEDROOMS_CHANGED, 'bedrooms');
export const livingroomsChanged = makeActionCreator(types.LIVINGROOMS_CHANGED, 'living_rooms');
export const bathroomsChanged = makeActionCreator(types.BATHROOMS_CHANGED, 'bathrooms');
export const areaChanged = makeActionCreator(types.AREA_CHANGED, 'area');
export const priceChanged = makeActionCreator(types.PRICE_CHANGED, 'price');

export const aliasChanged = makeActionCreator(types.ALIAS_CHANGED, 'seller_alias');
export const phoneChanged = makeActionCreator(types.PHONE_CHANGED, 'seller_phone');

export const attachBuildingChanged = makeActionCreator(types.ATTACH_BUILDING_CHANGED, 'mark');
export const attachDoorChanged = makeActionCreator(types.ATTACH_DOOR_CHANGED, 'mark');

export const singleChanged = makeActionCreator(types.SINGLE_CHANGED, 'single');
export const noUnit = makeActionCreator(types.NO_UNIT_CHANGED, 'no_unit');
export const villaChanged = makeActionCreator(types.VILLA_CHANGED, 'villa');
export const error = makeActionCreator(types.ERR_MSG, 'err_msg');

export const dataCleared = makeActionCreator(types.INPUT_DATA_CLEARED);

export const baseCleared = makeActionCreator(types.INPUT_BASE_CLEARED);
export const moreCleared = makeActionCreator(types.INPUT_MORE_CLEARED);
export const landlordCleared = makeActionCreator(types.INPUT_LANDLORD_CLEARED);


/*搜索小区*/
export const hiSearchHouseFetched = makeActionCreator(types.HI_SEARCH_HOUSE_FETCHED, 'communityList');
export const hiSearchCleared = makeActionCreator(types.HI_SEARCH_CLEARED);
export const hiSearchKeywordChanged = makeActionCreator(types.HI_SEARCH_KEYWORD_CHANGED, 'keyword');

export function fetchCommunityList(params) {
    return dispatch => {
        serviceAction(dispatch)({
            service: fetchCommunityListService,
            data: params,
            success: function(oData) {
                dispatch(hiSearchHouseFetched(oData))
            },
            error: function(oData) {

            }
        })
    }
}
