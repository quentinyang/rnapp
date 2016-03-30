import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function fetchHouseListService() {
    return ajax.get(urls.house.list)
}

export function fetchAppendHouseListService() {
    return ajax.get(urls.house.append)
}

export function fetchPrependHouseListService() {
    return ajax.get(urls.house.prepend)
}
// 我关注的房源
export function fetchAttentionHouseListService() {
    return ajax.get(urls.house.attention)
}

export function fetchAttentionAppendHouseListService() {
    return ajax.get(urls.house.attentionAppend)
}

export function fetchAttentionPrependHouseListService() {
    return ajax.get(urls.house.attentionPrepend)
}






