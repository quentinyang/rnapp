'use strict';

import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    Image,
    Alert,
    Modal,
    PixelRatio,
    Platform,
    StyleSheet,
    TouchableHighlight,
    InteractionManager
} from 'nuke';

import WithLabel from '../components/LabelTextInput';
import ErrorMsg from '../components/ErrorMsg';
import Pickers from '../components/Pickers';
import CheckID from '../components/CheckID';
import {qiniuUpload} from '../components/QiniuUploader';
import {imageSelected} from '../components/ImageSelected';
import TouchableSubmit from '../components/TouchableSubmit';
let commonStyle = require('../styles/main');
let ActionUtil = require('../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class Authentication extends Component {
    constructor(props) {
        super(props);
        this.business_card_info = null;
        this.id_card_info = null;
    }

    render() {
        let {userinfo, controller} = this.props;
        let district_block_list = controller.get('districts').district_block_list;

        let isOpacity = !!(userinfo.get('name') && userinfo.get('identity_card_number')
                        && userinfo.get('district_name') && userinfo.get('block_name')
                        && userinfo.get('business_card_url') && userinfo.get('identity_card_url')
                        && !controller.get('err_msg')
                        );

        return (
            <View>
            <ScrollView
                style={commonStyle.container}
            >
                <View style={[commonStyle.bgWhite, styles.boxTop]}>
                    <WithLabel
                        label='姓名'
                        defaultValue={userinfo.get('name')}
                        placeholder='请输入真实姓名'
                        underlineColorAndroid = 'transparent'
                        maxLength={10}
                        onChangeText={(v) => {this.singleAction('realNameChanged', v)}}
                    />
                    <WithLabel
                        label='身份证'
                        defaultValue={userinfo.get('identity_card_number')}
                        placeholder='请输入身份证号'
                        underlineColorAndroid = 'transparent'
                        maxLength={18}
                        onChangeText={(v) => {this.singleAction('IDCardNumChanged', v)}}
                    />
                    <WithLabel
                        label='工作区域'
                        value={userinfo.get('district_name') && userinfo.get('block_name') ? userinfo.get('district_name') + '-' + userinfo.get('block_name') : ''}
                        arrow={true}
                        placeholder='请选择工作区域'
                        underlineColorAndroid = 'transparent'
                        onFocus={() => {this.singleAction('addrPickerChanged', true)}}
                    />
                </View>
                {district_block_list ?
                <View style={[commonStyle.flex, commonStyle.row]}>
                    <Pickers
                        options={district_block_list}
                        cancel={() => {this.singleAction('addrPickerChanged', false)}}
                        confirm={this.confirmModal}
                        visible={controller.get('modal_visible')}
                        selectedOption={[userinfo.get('district_id'), userinfo.get('block_id')]}
                        num={2}
                    />
                </View>
                :null}
                <View style={[commonStyle.bgWhite, styles.boxTop]}>
                    <UploadCard
                        label='上传名片'
                        labelDesc='名片正面朝上'
                        source={userinfo.get('business_card_url')}
                        otherStyle={styles.borderBottom}
                        upCard={() => this.upCard('business_card')}
                    />
                    <UploadCard
                        label='上传身份证'
                        labelDesc='身份证正面朝上'
                        source={userinfo.get('identity_card_url')}
                        upCard={() => this.upCard('id_card')}
                    />
                </View>
                <ErrorMsg
                    errBoxStyle={{paddingLeft: 20}}
                    errText={controller.get('err_msg')}
                />
                <View style={styles.submitBox}>
                    <TouchableSubmit
                        opacity={isOpacity ? 1: 0.3}
                        onPress={this.handleSubmit}
                        submitText='提交'
                    />
                </View>
            </ScrollView>
            <SubmitModal
                visible={controller.get('submit_modal_visible')}
                onPress={this.submitSucModal}
            />
            </View>
        );
    }

    componentDidMount() {
        let {actions} = this.props;

        InteractionManager.runAfterInteractions(() => {
            actions.getAuthentication();
            actions.fetchAllBlock();
        });
    }

    singleAction(action, value) {
        let {actions} = this.props;
        actions.autErrMsgChanged('');
        actions[action](value);
    }

    upCard(state) {
        let {actions} = this.props;
        this.timer = setTimeout(() => {
            actions.autErrMsgChanged('图片加载中，请稍等...');
        }, 3000);

        var ops = {
            res_cb: this.imgPickerResponse,
            suc_cb: this.imgPickerSucCb.bind(null, state)
        }
        imageSelected(ops);
    }

    imgPickerSucCb = (state, res) => {
        let {actions} = this.props;
        let uri = '';
        if (Platform.OS === 'ios') {
            uri = res.uri.replace('file://', '');
        } else {
            uri = res.uri;
        }
        let arr = state.split('_');
        actions[arr[0] + arr[1] + 'UrlChanged'](uri);
        this[state+'_info'] = res;
    };

    imgPickerResponse = () => {
        this.timer && clearTimeout(this.timer);
        this.props.actions.autErrMsgChanged('');
    };

    handleSubmit = () => {
        let {userinfo, actions, actionsApp} = this.props;
        if(!this.checkForm(userinfo)) return;
        actionsApp.appLoadingChanged(true);
        var arr = [];
        !userinfo.get('business_card_id') && arr.push({id: 'business_card_id', url: userinfo.get('business_card_url')});
        !userinfo.get('identity_card_id') && arr.push({id: 'identity_card_id', url: userinfo.get('identity_card_url')});
        if(arr.length > 0) {
            this.upload(arr)
            .then((response) => {
                actionsApp.appLoadingChanged(false);
                let user = userinfo.toJS();
                let data = {...user, ...response};
                actions.submitAuthentication(data);
                console.log('xxxxxx',data);
            })
            .catch((err) => {
                actions.autErrMsgChanged(err);
            });
        }
    };

    upload = async function (data) {
        let {actions} = this.props;
        let imgObj = {};
        for(var i = 0; i < data.length; i++) {
            var value = await qiniuUpload(data[i].url);
            imgObj[data[i].id] = value.id;
        }
        return imgObj;
    };

    checkForm = (value) => {
        let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/;
        let cardInfo = new CheckID(value.get('identity_card_number')).info.isTrue;
        let {actions} = this.props;

        if(!reg.test(value.get('name'))) {
            actions.autErrMsgChanged('请输入您的真实姓名');
            return false;
        }
        if(!cardInfo) {
            actions.autErrMsgChanged('请输入正确的身份证号');
            return false;
        }
        return true;
    };

    confirmModal = (d) => {
        let data = {
            district_id: d[0].id,
            district_name: d[0].name,
            block_id: d[1].id,
            block_name: d[1].name
        };
        this.singleAction('workAddrChanged', data);
        this.singleAction('addrPickerChanged', false);
    };

    submitSucModal = () => {
        let {navigator, actions} = this.props;
        actions.autSubmitModalChanged(false);
        navigator.pop();
    };
}

let errMsgs = {
    'wrongName': '请输入您的真实姓名',
    'wrongId': '请输入正确的身份证号',
};

class UploadCard extends Component {
    render() {
        let {otherStyle} = this.props;
        return (
            <View style={[commonStyle.flex, commonStyle.row, styles.cardBox, otherStyle]}>
                <View style={styles.cardLeft}>
                    <Text>{this.props.label}</Text>
                    <Text style={commonStyle.smallFt}>{this.props.labelDesc}</Text>
                </View>
                <TouchableHighlight
                    style={[commonStyle.center, styles.addBox]}
                    underlayColor='#fff'
                    onPress={this.props.upCard}
                >
                    {this.props.source ?
                    <Image
                        source={{uri: this.props.source}}
                        style={styles.showImg}
                    />
                    :
                    <Image
                        source={require('../images/add.png')}
                        style={styles.addImg}
                    />
                    }
                </TouchableHighlight>
            </View>
        );
    }
}

class SubmitModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {visible, onPress} = this.props;
        return (
            <Modal visible={visible} transparent={true} onRequestClose={() => {}}>
                <View style={styles.bgWrap}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.textCenter}>{"提交成功\n1个工作日内审核"}</Text>

                        <TouchableHighlight
                            style={[commonStyle.center, styles.logoutSure]}
                            onPress={onPress}
                            underlayColor='#04c1ae'
                        >
                            <View>
                                <Text style={[styles.updateBtnRightText]}>确定</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    boxTop: {
        marginTop: 15
    },
    cardBox: {
        height: 85,
        paddingHorizontal: 15
    },
    cardLeft: {
        width: 115
    },
    borderBottom: {
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9'
    },
    addBox: {
        width: 86,
        height: 60,
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        borderRadius: 2
    },
    showImg: {
        width: 86,
        height: 60
    },
    addImg: {
        width: 30,
        height: 30
    },
    submitBox: {
        paddingHorizontal: 20
    }
});
