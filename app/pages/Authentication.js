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
        this.state = {
            business_card: '',
            id_card: ''
        };

        this.district_block_list = [
            {
                blocks: [
                    {
                        id: '77',
                        name: '北蔡'
                    },
                    {
                        id: '78',
                        name: '碧云'
                    },
                    {
                        id: '75',
                        name: '北蔡'
                    },
                    {
                        id: '74',
                        name: '碧云'
                    },
                    {
                        id: '73',
                        name: '北蔡'
                    },
                    {
                        id: '72',
                        name: '碧云'
                    },
                ],
                id: '7',
                name: '浦东'
            },
            {
                blocks: [
                    {
                        id: '42',
                        name: '北蔡2'
                    },
                    {
                        id: '43',
                        name: '碧云20'
                    },
                    {
                        id: '45',
                        name: '北蔡2'
                    },
                    {
                        id: '44',
                        name: '碧云21'
                    },
                    {
                        id: '47',
                        name: '北蔡2'
                    },
                    {
                        id: '22',
                        name: '碧云22'
                    },
                ],
                id: '11',
                name: '闵行'
            },
        ];
    }

    render() {
        let {userinfo, controller} = this.props;
        let district_block_list = this.district_block_list;

        let isOpacity = !!(userinfo.get('name') && userinfo.get('identity_card_number') && userinfo.get('district_name') && userinfo.get('block_name')
                        && !controller.get('err_msg')
                        && this.state.business_card && this.state.id_card
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
                <View style={[commonStyle.flex, commonStyle.row]}>
                    <Pickers
                        options={district_block_list}
                        cancel={() => {this.singleAction('addrPickerChanged', false)}}
                        confirm={this.confirmModal}
                        visible={controller.get('modal_visible')}
                        num={2}
                    />
                </View>
                <View style={[commonStyle.bgWhite, styles.boxTop]}>
                    <UploadCard
                        label='上传名片'
                        labelDesc='名片正面朝上'
                        source={this.state.business_card}
                        otherStyle={styles.borderBottom}
                        upCard={() => this.upCard('business_card')}
                    />
                    <UploadCard
                        label='上传身份证'
                        labelDesc='身份证正面朝上'
                        source={this.state.id_card}
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
        let source = {};
        if (Platform.OS === 'ios') {
            source = {uri: res.uri.replace('file://', '')};
        } else {
            source = {uri: res.uri};
        }
        let json = {};
        json[state] = source;

        this.setState(json);
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
        this.upload(this.business_card_info.uri, this.id_card_info.uri)
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
    };

    upload = async function (business_uri, id_uri) {
        let {actions} = this.props;
        var business_img = await qiniuUpload(business_uri);
        actions.businessCardChanged(business_img.id);
        var id_img = await qiniuUpload(id_uri);
        actions.identityCardChanged(id_img.id);
        return {
            business_card_id: business_img.id,
            identity_card_id: id_img.id
        }
    }

    success(data) {
        console.log('success',data);
    }

    error(data) {
        console.log('error', error);
    }

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

    }
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
                        source={this.props.source}
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
