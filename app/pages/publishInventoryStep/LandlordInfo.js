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
        ActionUtil.setActionWithExtend(actionType.BA_SEND_ONVIEW, {"bp": this.props.route.bp});
        this.height = Dimensions.get('window').height;
    }

    render() {
        let {houseForm, controller, communityData} = this.props.houseInput;
        let isOpacity = !!houseForm.get('seller_phone');

        return (
            <View style={styles.container}>
                <PublishTitle>这<Text style={styles.colorFFDB}>1</Text>步即可发布</PublishTitle>
                <Text style={[styles.baseInfo, styles.paddingHorizon]}>房源为“{houseForm.get('community_name')}{!controller.get('single')? houseForm.get('building_num')+'号':'独栋'}{!controller.get('villa')?houseForm.get('door_num')+'室':'别墅'}”</Text>
                <View style={styles.colorWhite}>
                    <WithLabel
                        label='称呼'
                        ref='alias'
                        value={houseForm.get('seller_alias')}
                        placeholder='(选填)如张先生'
                        underlineColorAndroid = 'transparent'
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
                        onPress={this.handleFirstSubmit}
                        submitText='发布'
                    />
                </View>
            </View>
        );
    }

    singleAction(action, value) {
        this.props.actions[action](value);
    }

    toggleAttach(actionLog, action, value, secAction, thirdAction) {
        ActionUtil.setAction(actionLog);
        if(value) {
            this.singleAction(secAction, '');
            if(thirdAction) {
                this.singleAction(thirdAction, 1);
            }
        }

        this.singleAction(action, value);
    }

    handleFirstSubmit = () => {
        let houseForm = this.props.houseInput.houseForm.toJS();

        ActionUtil.setAction(actionType.BA_SEND_FINISH);
        this.submitSuccess(houseForm);
    };

    submitSuccess(params) {
        let {actions, navigator} = this.props;

        inputHouseService({body:params})
        .then((oData) => {
            ActionUtil.setActionWithExtend(actionType.BA_SEND_HOUSE_SUCCESS, {"vpid": oData.property_id});
            navigator.push({
                component: HouseInputSuccessContainer,
                name: 'houseInputSuccess',
                title: '发布成功',
                data: oData,
                hideNavBar: false,
                backLog: actionType.BA_SEND_SUCCESS_RETURN,
                bp: this.pageId
            });
            actions.dataCleared();
        })
        .catch((error) => {
            ActionUtil.setActionWithExtend(actionType.BA_SEND_HOUSE_FAIL, {"error_type": error.status || ""});
            actions.error(error.msg);
        })
    }

}

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