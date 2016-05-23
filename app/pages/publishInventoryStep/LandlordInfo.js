'use strict';

import {
    React, Component,
    View, Text, Image, StyleSheet,
    PixelRatio,
    TouchableHighlight, Alert, Dimensions
} from 'nuke';

import {inputHouseService} from '../../service/houseInputService';
import WithLabel from '../../components/LabelTextInput';
import PublishTitle from '../../components/PublishTitle';
import ErrorMsg from '../../components/ErrorMsg';
import TouchableSubmit from '../../components/TouchableSubmit';
import HouseInputSuccessContainer from '../../containers/HouseInputSuccessContainer';
let ActionUtil = require( '../../utils/ActionLog');
import * as actionType from '../../constants/ActionLog'

export default class LandlordInfoPage extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_SEND;
        ActionUtil.setAction(actionType.BA_SENDTHREE_THREE_ONVIEW);
    }

    render() {
        let {houseForm, controller, communityData} = this.props.houseInput;
        let isOpacity = !!houseForm.get('seller_phone');

        return (
            <View style={styles.container}>
                <PublishTitle>这<Text style={styles.colorFFDB}>1</Text>步即可发布</PublishTitle>
                <View style={styles.paddingHorizon}><Text style={styles.baseInfo}>房源为“{houseForm.get('community_name')}{!controller.get('single')? houseForm.get('building_num')+'号':'独栋'}{!controller.get('villa')?houseForm.get('door_num')+'室':'别墅'}”</Text></View>
                <View style={styles.colorWhite}>
                    <WithLabel
                        label='称呼'
                        ref='alias'
                        value={houseForm.get('seller_alias')}
                        placeholder='(选填)如张先生'
                        underlineColorAndroid = 'transparent'
                        onBlur={() => ActionUtil.setAction(actionType.BA_SENDTHREE_THREE_NAME)}
                        onChangeText={(v) => {this.singleAction('aliasChanged', v)}}
                    />
                    <WithLabel
                        label='电话'
                        ref='phone'
                        keyboardType='numeric'
                        value={houseForm.get('seller_phone')}
                        placeholder='输入联系电话'
                        underlineColorAndroid = 'transparent'
                        maxLength={11}
                        onBlur={() => ActionUtil.setAction(actionType.BA_SENDTHREE_THREE_TEL)}
                        onChangeText={(v) => {this.singleAction('phoneChanged', v)}}
                    />
                </View>
                <ErrorMsg
                    errBoxStyle={{paddingLeft: 20}}
                    errText={controller.get('err_msg')}
                />
                <View style={styles.paddingHorizon}>
                    <TouchableSubmit
                        opacity={isOpacity ? 1: 0.3}
                        onPress={this.handleThirdSubmit}
                        submitText='发布'
                    />
                </View>
            </View>
        );
    }

    singleAction(action, value) {
        this.props.actions[action](value);
    }

    checkForm() {
        let houseForm = this.props.houseInput.houseForm.toJS(),
            regphone = /^1\d{10}$|^0\d{10,11}$|^\d{8}$/g;

        if(!regphone.test(houseForm.seller_phone)) {
            return 'wrongPhone';
        }
        return '';
    }

    handleThirdSubmit = () => {
        let houseForm = this.props.houseInput.houseForm.toJS(),
            msg = this.checkForm();

        msg ? this.props.actions.error(errMsgs[msg]):this.submitSuccess(houseForm);
    };

    submitSuccess(params) {
        let {actions, navigator} = this.props;

        inputHouseService({body:params})
        .then((oData) => {
            ActionUtil.setActionWithExtend(actionType.BA_SENDTHREE_THREE_RELEASE, {"vpid": oData.property_id});
            let routeStack = this.props.navigator.state.routeStack;
            let newStack = routeStack.slice(0, routeStack.length-3);
            navigator.immediatelyResetRouteStack(newStack);
            navigator.push({
                component: HouseInputSuccessContainer,
                name: 'houseInputSuccess',
                title: '发布成功',
                data: oData,
                hideNavBar: false,
                bp: this.pageId
            });
            actions.dataCleared();
        })
        .catch((error) => {
            ActionUtil.setActionWithExtend(actionType.BA_SENDTHREE_THREE_RELEASE, {"error_type": error.status || ""});
            actions.error(error.msg);
        })
    }
}

const errMsgs = {
    'wrongPhone': '联系电话有误'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    colorWhite: {
        backgroundColor: '#fff'
    },
    colorFFDB: {
        color: '#ff6d4b'
    },
    baseInfo: {
        marginBottom: 15,
        fontSize: 17,
        color: '#3e3e3e'
    },
    paddingHorizon: {
        paddingHorizontal: 20
    },
});