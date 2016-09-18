import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

export function getToken() {
    return ajax.post(urls().token)
}
