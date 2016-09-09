'use strict';

import {
    React, Component,
    View, Text, Image, StyleSheet,
    PixelRatio,
    InteractionManager,
    TouchableHighlight, Alert, Dimensions
} from 'nuke';

import {basicInventoryDuplicateService, allowToInputService} from '../../service/houseInputService';
import Header from '../../components/Header';
import WithLabel from '../../components/LabelTextInput';
import Attached from '../../components/Attached';
import PublishStepBlock from '../../components/PublishStepBlock';
import ErrorMsg from '../../components/ErrorMsg';
import TouchableSubmit from '../../components/TouchableSubmit';
import PublishSecondStepContainer from '../../containers/PublishSecondStepContainer';
import SearchCommunityContainer from '../../containers/SearchCommunityContainer';
let ActionUtil = require( '../../utils/ActionLog');
import * as actionType from '../../constants/ActionLog';

import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

export default class BaseInfoPage extends Component {
    constructor(props) {
        super(props);
        let {route, actions, navigator} = this.props;
        ActionUtil.setActionWithExtend(actionType.BA_SENDONE_THREE_ONVIEW, {"bp": route.bp});
    }

    render() {
        let {navigator, route} = this.props;
        let {houseForm, controller} = this.props.houseInput;
        let isOpacity = !!(
            houseForm.get('community_name') &&
            !controller.get('err_msg') && 
            (controller.get('single') && houseForm.get('door_num') || 
                controller.get('villa') && houseForm.get('building_num') ||
                houseForm.get('door_num') && houseForm.get('building_num')
                )
        );

        return (
            <View style={styles.container}>
                <View>
                    {route.hideNavBar?<Header title='发房' style={styles.bgHeader} />:null}
                    <PublishStepBlock step={1} />
                    <View style={styles.colorWhite}>
                        <WithLabel
                            label='小区'
                            special={true}
                            specialText1={houseForm.get('community_name')}
                            specialText2={houseForm.get('address')}
                            arrow={true}
                            onClick={() => {
                                ActionUtil.setAction(actionType.BA_SENDONE_THREE_COM);
                                navigator.push({
                                    component: SearchCommunityContainer,
                                    name: 'SearchCommunity',
                                    title: '',
                                    hideNavBar: true,
                                    backLog: '',
                                    bp: ''
                                });
                            }}
                        />
                        <WithLabel
                            label='楼栋'
                            rightText='号/座'
                            value={houseForm.get('building_num')}
                            placeholder={controller.get('single')?'无':'输入楼号/座号'}
                            editable={controller.get('single')? false: true}
                            underlineColorAndroid = 'transparent'
                            maxLength={5}
                            onBlur={() => ActionUtil.setAction(actionType.BA_SENDONE_THREE_BUILDING)}
                            onChangeText={(v) => {this.singleAction('buildingChanged', v.trim())}}
                        >
                            <Attached
                                isSelected={controller.get('single')}
                                attachedText='无'
                                toggleAttach={() => {
                                    this.toggleAttach(actionType.BA_SENDONE_THREE_ONEBUILD, 'singleChanged', !controller.get('single'), 'buildingChanged', 'attachBuildingChanged');
                                    this.props.actions.unitChanged('');
                                }}
                            />
                        </WithLabel>


                        <WithLabel
                            label='单元'
                            rightText='单元'
                            value={houseForm.get('unit_num')}
                            placeholder={controller.get('single') ? '无' : '输入单元号'}
                            editable={controller.get('single') ? false : true}
                            underlineColorAndroid = 'transparent'
                            maxLength={5}
                            onBlur={() => ActionUtil.setAction(actionType.BA_SENDONE_THREE_BUILDING)}
                            onChangeText={(v) => {this.singleAction('unitChanged', v.trim())}}
                        >
                            <View style={{width: 90}}></View>
                        </WithLabel>


                        <WithLabel
                            label='房号'
                            rightText='室'
                            value={houseForm.get('door_num')}
                            placeholder={controller.get('villa')?'无':'输入房号'}
                            underlineColorAndroid = 'transparent'
                            editable={controller.get('villa')? false: true}
                            maxLength={5}
                            onBlur={() => ActionUtil.setAction(actionType.BA_SENDONE_THREE_ROOM)}
                            onChangeText={(v) => {this.doorChanged(v.trim())}}
                        >
                            <Attached
                                isSelected={controller.get('villa')}
                                attachedText='无'
                                toggleAttach={() => {this.toggleAttach(actionType.BA_SENDONE_THREE_VILLA, 'villaChanged', !controller.get('villa'), 'doorChanged', 'attachDoorChanged'); this.props.actions.floorChanged('');}}
                            />
                        </WithLabel>
                        <WithLabel
                            label='楼层'
                            rightText='层'
                            value={houseForm.get('floor')}
                            placeholder={controller.get('villa') ? '无' : '输入楼层'}
                            underlineColorAndroid = 'transparent'
                            editable={controller.get('villa')? false: true}
                            maxLength={2}
                            onChangeText={(v) => {this.singleAction('floorChanged', v.trim())}}
                        >
                            <View style={{width: 90}}></View>
                        </WithLabel>
                    </View>
                    <ErrorMsg
                        errBoxStyle={{paddingLeft: 20}}
                        errText={controller.get('err_msg')}
                    />
                    <View style={styles.submitBox}>
                        <TouchableSubmit
                            opacity={isOpacity ? 1: 0.3}
                            onPress={this.handleFirstSubmit}
                            submitText='下一步'
                        />
                    </View>
                </View>
            </View>
        );
    }

    componentDidMount() {
        let {route, actionsApp} = this.props;
        InteractionManager.runAfterInteractions(() => {
            allowToInputService()
            .then((data) => {
                if(!data.is_can_input) {
                    Alert.alert('', '亲，您已经发了'+data.daily_max_input_house_count+'套房了\n明天再来吧~', [
                    {
                        text: '好的',
                        onPress: () => {}
                    }])
                }
            })
            .catch((error) => {
                if (error && error.codeStatus == 401) {
                    error.visible = true;
                    actionsApp.webAuthentication(error);
                } else {
                    Alert.alert('', error.msg || '网络不太顺畅');
                }
            })
        });

    }

    singleAction(action, value) {
        let {houseInput, actions} = this.props;

        houseInput.controller.get('err_msg') && actions.error('');
        actions[action](value);
    }

    doorChanged(value) {
        let {actions} = this.props;

        this.singleAction('doorChanged', value);
        if(value.length == 3 || value.length == 4) {
            let floor = value.slice(0, -2);
            actions.floorChanged(floor);
        } else {
            actions.floorChanged('');
        }
    }

    toggleAttach(actionLog, action, value, secAction, thirdAction) {
        ActionUtil.setAction(actionLog);
        if(value) {
            this.singleAction(secAction, '');
        }

        if(thirdAction) {
            this.singleAction(thirdAction, value? 1: 0);
        }
        this.singleAction(action, value);
    }


    checkForm() {
        let houseForm = this.props.houseInput.houseForm.toJS(),
            regwords =  /楼|幢|栋|号|室/g;

        if(regwords.test(houseForm.building_num)) {
            return 'wrongBuilding';
        }
        return '';
    }

    handleFirstSubmit = () => {
        let houseForm = this.props.houseInput.houseForm.toJS(),
            msg = this.checkForm();

        dismissKeyboard();
        msg ? this.props.actions.error(errMsgs[msg]):this.submitSuccess(houseForm);
    };

    submitSuccess(params) {
        let {actions, actionsApp, navigator} = this.props;
        actionsApp.appLoadingChanged(true);
        basicInventoryDuplicateService({body:params})
        .then(() => {
            actionsApp.appLoadingChanged(false);
            actions.error('');
            navigator.push({
                component: PublishSecondStepContainer,
                name: 'publishInventory',
                title: '更多房源信息',
                backLog: actionType.BA_SENDTWO_THREE_RETURN,
                hideNavBar: false,
            });
            ActionUtil.setAction(actionType.BA_SENDONE_THREE_NEXT);
        })
        .catch((error) => {
            actionsApp.appLoadingChanged(false);
            ActionUtil.setActionWithExtend(actionType.BA_SENDONE_THREE_NEXT, {"error_type": error.status || ""});
            actions.error(error.msg);
        })
    }

    componentWillUnmount() {
        this.props.actions.baseCleared();
    }

}

let errMsgs = {
    'wrongBuilding': '请输入正确的楼栋号'
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    bgHeader: {
      backgroundColor: '#f8f8f8'
    },
    colorWhite: {
        backgroundColor: '#fff'
    },
    colorFFDB: {
        color: '#ff6d4b'
    },
    submitBox: {
        paddingHorizontal: 20
    }
});