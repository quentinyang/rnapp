import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){

    function getWelfareList(data) {
        return ajax.get(urls().card.welfare, data);
    }
    function fetchCouponStatusService() {
        return ajax.get(urls().card.getNewWelfare);
    }
    return {
        getWelfareList: getWelfareList,
        fetchCouponStatusService: fetchCouponStatusService
    };
}();