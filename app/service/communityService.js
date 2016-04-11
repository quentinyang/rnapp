import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function fetchCommunityListService(params) {
    return ajax.get(urls.community.list, {
        data: params
    })
}