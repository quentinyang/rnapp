import { combineReducers } from 'redux';
import * as types from '../constants/HouseInput';
import Immutable from 'immutable';

let initInput = Immutable.fromJS({
    'seller_alias': '',
    'seller_phone': '',
    'city_id': '',
    'community_id': '',
    'community_name': '',
    'address': '',
    'building_num': '',
    'unit_num': '',
    'door_num': '',
    'has_no_building_num': 0,
    'has_no_door_num': 0,
    'price': '',
    'area': '',
    'bedrooms': '',
    'living_rooms': '',
    'bathrooms': ''
});

function houseForm(state = initInput, action) {
    switch(action.type) {
        case types.ALIAS_CHANGED:
            return state.set('seller_alias', action.seller_alias);
        case types.PHONE_CHANGED:
            return state.set('seller_phone', action.seller_phone);
        case types.COMMUNITY_CHANGED:
            return state.set('community_id', action.community.id).set('community_name', action.community.name).set('address', action.community.address);
        case types.BUILDING_CHANGED:
            return state.set('building_num', action.building_num);
        case types.UNIT_CHANGED:
            return state.set('unit_num', action.unit_num);
        case types.DOOR_CHANGED:
            return state.set('door_num', action.door_num);
        case types.PRICE_CHANGED:
            return state.set('price', action.price);
        case types.AREA_CHANGED:
            return state.set('area', action.area);
        case types.BEDROOMS_CHANGED:
            return state.set('bedrooms', action.bedrooms);
        case types.LIVINGROOMS_CHANGED:
            return state.set('living_rooms', action.living_rooms);
        case types.BATHROOMS_CHANGED:
            return state.set('bathrooms', action.bathrooms);
        case types.ATTACH_BUILDING_CHANGED:
            return state.set('has_no_building_num', action.mark);
        case types.ATTACH_DOOR_CHANGED:
            return state.set('has_no_door_num', action.mark);
        case types.INPUT_DATA_CLEARED:
            return initInput;
        default:
            return state;
    }
}

let controlData = Immutable.fromJS({
    'search': false,
    'single': false, // 独栋
    'no_unit': true, //单元
    'villa': false, // 别墅
    'err_msg': ''
});

export function controller(state = controlData, action) {
    switch(action.type) {
        case types.SEARCH_CHANGED:
            return state.set('search', action.search);
        case types.SINGLE_CHANGED:
            return state.set('single', action.single).set('villa', false);
        case types.NO_UNIT_CHANGED:
            return state.set('no_unit', action.no_unit);
        case types.VILLA_CHANGED:
            return state.set('villa', action.villa).set('single', false);
        case types.ERR_MSG:
            return state.set('err_msg', action.err_msg);
        case types.INPUT_DATA_CLEARED:
            return controlData;
        default:
            return state;
    }
}

let initialState = {
    results: [],
    keyword: ''
};

function communityData(state = Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case types.HI_SEARCH_HOUSE_FETCHED:
            return state.set('results', Immutable.fromJS(action.communityList));
            break;
        case types.HI_SEARCH_KEYWORD_CHANGED:
            return state.set('keyword', action.keyword);
            break;
        case types.HI_SEARCH_CLEARED:
            return Immutable.fromJS(initialState);
            break;
        default:
            return state;
    }
}

export default combineReducers({
    houseForm,
    controller,
    communityData
});