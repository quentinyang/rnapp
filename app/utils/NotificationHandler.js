import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import * as common from '../constants/Common';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

module.exports = function() {
	function logout() {
		AsyncStorageComponent.get(common.USER_TOKEN_KEY)
        .then((token) => {
            if (token) {
                AsyncStorageComponent.multiRemove([common.USER_TOKEN_KEY, common.USER_ID]);
                if (Platform.OS === 'ios') {
                    Alert.alert('提示', '您的账号在另外一台设备登陆，被迫下线！', [
                        {text: '知道了', onPress: () => {
                            AsyncStorageComponent.get('user_phone')
                            .then((value) => {
                                _navigator.resetTo({
                                    component: LoginContainer,
                                    name: 'login',
                                    title: '登录',
                                    phone: value,
                                    hideNavBar: true
                                });
                            });
                        }}
                    ]);
                } else {
                    this.setState({
                        showModal: true
                    });
                }
            }
        });
	}

	function openPage(nav, notifData) {
		let isOffline = notifData.isOffline;
        let newNotifData = JSON.parse(notifData.payloadMsg);
        let page = newNotifData.data.anchor;

console.log("==========notifData:", notifData);
		if(!isOffline && page) {
			console.log("======= no offline");
			nav.push(Object.assign(routes[page], newNotifData.data.extras.nav));
		}
	}

	function openURL(nav, notifData) {
		let isOffline = notifData.isOffline;
        let newNotifData = JSON.parse(notifData.payloadMsg);
        let page = newNotifData.data.anchor;

console.log("==========notifData:", notifData);
		if(!isOffline && page) {
			console.log("======= no offline");
			nav.push(Object.assign(routes[page], newNotifData.data.extras.nav));
		}
	}

	return {
		logout: logout,
		openPage: openPage,
		openURL: openURL,
	};
}();