import {Platform, Alert} from 'nuke';
import Toast from 'react-native-root-toast';
import Immutable from 'immutable';
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import * as common from '../constants/Common';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

module.exports = function() {
	function logout(nav) {
		AsyncStorageComponent.get(common.USER_TOKEN_KEY)
        .then((token) => {
            if (token) {
                AsyncStorageComponent.multiRemove([common.USER_TOKEN_KEY, common.USER_ID]);
                if (Platform.OS === 'ios') {
                    Alert.alert('提示', '您的账号在另外一台设备登陆，被迫下线！', [
                        {text: '知道了', onPress: () => {
                            AsyncStorageComponent.get('user_phone')
                            .then((value) => {
                                nav.resetTo(Object.assign(routes["login"], {phone: value}));
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

		if(isOffline && page) {
			nav.push(Object.assign(routes[page], {"item": Immutable.fromJS(newNotifData.data.extras.nav)}));
		}
	}

	function openURL(nav, notifData) {
		let isOffline = notifData.isOffline;
        let newNotifData = JSON.parse(notifData.payloadMsg);
        let page = newNotifData.data.anchor;

		if(isOffline && page) {
			nav.push(Object.assign(routes["webView"], {"url": page}, newNotifData.data.extras));
		}
	}

	function messageNotice(actions, notifData) {
		actions.msgNoticeGeted({
			visible: true,
			msg: notifData.data.msg
		});
	}

	function showToast(notifData) {
		Toast.show(notifData.data.msg, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER
        });
	}

	function showForceUpdate(actions) {
		actions.forceUpdateGeted();
	}

	return {
		logout: logout,
		openPage: openPage,
		openURL: openURL,
		messageNotice: messageNotice,
		showToast: showToast,
		showForceUpdate: showForceUpdate,
	};
}();