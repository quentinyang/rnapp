import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

export function fetchCommunityListService(params) {
    return ajax.get(urls().community.list, {
        data: params
    })
}