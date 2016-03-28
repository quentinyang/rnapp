import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function fetchHouseListService() {
    return ajax.get(urls.house.list)
}

export function fetchAppendHouseListService() {
    return ajax.get(urls.house.append)
}
