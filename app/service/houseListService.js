import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function fetchHouseListService(params) {
    console.log('page: ', params.page)
    return ajax.get(urls.house.list, {
        data: params
    })
}

export function fetchAppendHouseListService(params) {
    console.log('page: ', params.page)
    return ajax.get(urls.house.append, {
        data: params
    })
}

export function fetchPrependHouseListService(params) {
    return ajax.get(urls.house.prepend, {
        data: params
    })
}
// 我关注的房源
export function fetchAttentionHouseListService() {
    return ajax.get(urls.house.attention)
}

export function fetchAttentionAppendHouseListService(params) {
    return ajax.get(urls.house.attentionAppend, {
        data: params
    })
}

export function fetchAttentionPrependHouseListService() {
    return ajax.get(urls.house.attentionPrepend)
}

export function fetchSimilarHouseListService(params) {
    return ajax.get(urls.house.similar, {
        data: params
    })
}

export function fetchHouseFilterService() {
    return ajax.get(urls.house.filters)
}








