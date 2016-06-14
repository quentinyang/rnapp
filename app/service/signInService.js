import * as ajax from '../utils/Ajax';
import * as urls from '../config/urls';

export function signInfoService() {
    return ajax.get(urls.signIn.info)
};