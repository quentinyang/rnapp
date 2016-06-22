import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){
    function basicInventoryDuplicateService(data) {
        return ajax.post(urls().house.baseDuplicate, data);
    }

    function inputHouseService(data) {
        return ajax.post(urls().house.input, data);
    }

    function allowToInputService() {
        return ajax.get(urls().house.allowToInput);
    }

    return {
        basicInventoryDuplicateService: basicInventoryDuplicateService,
        inputHouseService: inputHouseService,
        allowToInputService: allowToInputService
    };
}();