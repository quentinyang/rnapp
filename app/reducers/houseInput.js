import { combineReducers } from 'redux';
import * as types from '../constants/HouseInput';
import Immutable from 'immutable';

let initInput = Immutable.fromJS({
    'seller_alias': '',
    'seller_phone': '',
    'city_id': '',
    'community_id': '',
    'building_num': '',
    'unit_num': '',
    'door_num': '',
    'price': '',
    'area': '',
    'bedrooms': '',
    'living_rooms': '',
    'bathrooms': '',
    'floor': '',
    'total_floors': '',
    'orientation': '',
    'fitment': '',
    'building_type': '',
    'tags': [],
    'listed_year': '',
    'listed_month': '',
    'listed_at': ''
});

function houseForm(state = initInput, action) {
    switch(action.type) {
        case types.ALIAS_CHANGED:
            return state.set('seller_alias', action.seller_alias);
        case types.PHONE_CHANGED:
            return state.set('seller_phone', action.seller_phone);
        case types.COMMUNITY_CHANGED:
            return state.set('community_id', action.id);
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
        case types.FLOOR_CHANGED:
            return state.set('floor', action.floor);
        case types.TOTALFLOOR_CHANGED:
            return state.set('total_floors', action.total_floors);
        case types.ORIENTATION_CHANGED:
            return state.set('orientation', action.orientation);
        case types.FITMENT_CHANGED:
            return state.set('fitment', action.fitment);
        case types.BUILDINGTYPE_CHANGED:
            return state.set('building_type', action.building_type);
        case types.TAGS_CHANGED:
            return state.set('tags', action.tags);

        case types.LISTEDAT_YEAR_CHANGED:
            return state.set('listed_year', action.listed_year);
        case types.LISTEDAT_MONTH_CHANGED:
            return state.set('listed_month', action.listed_month);
        case types.INPUT_DATA_CLEARED:
            return initInput;
        default:
            return state;
    }
}

let initParams = Immutable.fromJS({
    'community_id': '',
    'community_name': '',
    'keyword': ''
});

export function params(state = initParams, action) {
    switch(action.type) {
        case types.COMMUNITY_CHANGED:
            return state.set('community_id', action.id).set('community_name', action.name).set('keyword', '');
        case types.KEYWORD_CHANGED:
            return state.set('keyword', action.keyword).set('community_id', '').set('community_name', '');
        case types.INPUT_DATA_CLEARED:
            return initParams;
        default:
            return state;
    }
}

let initCommunityKeyword = Immutable.fromJS({
    'keyword': ''
})

export function communityKeyword(state = initCommunityKeyword, action) {
    switch(action.type) {
        case types.COMMUNITY_KEYWORD_CHANGED:
            return state.set('keyword', action.keyword);
        case types.INPUT_DATA_CLEARED:
            return initCommunityKeyword;
        default:
            return state;
    }
}



let controlData = Immutable.fromJS({
    'err_msg': ''
});

export function controller(state = controlData, action) {
    switch(action.type) {
        case types.ERR_MSG:
            return state.set('err_msg', action.err_msg);
        default:
            return state;
    }
}

export function defaultData(state = Immutable.fromJS([]), action) {
    switch(action.type) {
        case types.INPUT_DATA:
            return state = Immutable.fromJS(action.input_data);
        case types.INPUT_DATA_CLEARED:
            return Immutable.fromJS([]);
        default:
            return state;
    }
}

let initUiState = Immutable.fromJS({
    'aucompleteSelected': false,
    'single': false, // 独栋
    'villa': false // 别墅
});

export function uiState(state = initUiState, action) {
    switch (action.type) {
        case types.AUTOCOMPLETE_SELECTED:
            return state.set('aucompleteSelected', action.state);
        case types.SINGLE_CHANGED:
            return state.set('single', action.single).set('villa', false);
        case types.VILLA_CHANGED:
            return state.set('villa', action.villa).set('single', false);
        case types.INPUT_DATA_CLEARED:
            return initUiState;
        default:
            return state;
    }
}

export function communityList(state = Immutable.fromJS([]), action) {
    switch(action.type) {
        case types.COMMUNITY_SEARCHED:
            return Immutable.fromJS(action.communityList);
        case types.INPUT_DATA_CLEARED:
            return Immutable.fromJS([]);
        default:
            return state;
    }
}

export default combineReducers({
    houseForm,
    params,
    controller,
    defaultData,
    uiState,
    communityList,
    communityKeyword
});