import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){
    function tradeService(data) {
        return ajax.post(urls().pay.order, data);
    }

    function resultService(data) {
        return ajax.post(urls().pay.result, data);
    }

    function realNameService(data) {
        return ajax.post(urls.pay.realName, data);
    }

    function getAlipayStatusService(data) {
        return ajax.get(urls.pay.aliStatus, {data:data});
    }

    return {
        tradeService: tradeService,
        resultService: resultService,
        realNameService: realNameService,
        getAlipayStatusService: getAlipayStatusService
    };
}();