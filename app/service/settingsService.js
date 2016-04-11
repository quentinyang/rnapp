import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function fetchContactHouseService(params) {
    console.log('page: ', params.page)
    return ajax.get(urls.settings.contactHouse, {
        data: params
    })
}

export function fetchInputHouseService(params) {
    console.log('page: ', params.page)
    return ajax.get(urls.settings.inputHouse, {
        data: params
    })
}