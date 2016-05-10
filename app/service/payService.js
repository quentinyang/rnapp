import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){
    function tradeService(data) {
        return ajax.post(urls.pay.order, data);
    }

    return {
        tradeService: tradeService
    };
}();