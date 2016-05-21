import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){
    function basicInventoryDuplicateService(data) {
        return ajax.post(urls.house.baseDuplicate, data);
    }

    function inputHouseService(data) {
        return ajax.post(urls.house.input, data);
    }

    return {
        basicInventoryDuplicateService: basicInventoryDuplicateService,
        inputHouseService: inputHouseService
    };
}();