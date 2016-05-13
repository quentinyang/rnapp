import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){
    function tradeService(data) {
        return ajax.post(urls.pay.order, data);
    }

    function resultService(data) {
        return ajax.post(urls.pay.result, data);
    }

    return {
        tradeService: tradeService,
        resultService: resultService
    };
}();