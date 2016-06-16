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
import * as actionType from '../../constants/ActionLog'

export default class BaseInfoPage extends Component {
    constructor(props) {
        super(props);
        let {route, actions, navigator} = this.props;
        ActionUtil.setActionWithExtend(actionType.BA_SENDONE_THREE_ONVIEW, {"bp": route.bp});
    }

    render() {
        let {navigator, route} = this.props;
        let {houseForm, controller} = this.props.houseInput;
        let isOpacity = !!(houseForm.get('community_name') && !controller.get('err_msg') && (controller.get('single')? true: houseForm.get('building_num')) && (controller.get('villa')?true:houseForm.get('door_num')));

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
                            placeholder={controller.get('single')?'无':'输入楼/座号'}
                            editable={controller.get('single')? false: true}
                            underlineColorAndroid = 'transparent'
                            onBlur={() => ActionUtil.setAction(actionType.BA_SENDONE_THREE_BUILDING)}
                            onChangeText={(v) => {this.singleAction('buildingChanged', v.trim())}}
                        >
                            <Attached
                                isSelected={controller.get('single')}
                                attachedText='无'
                                toggleAttach={() => this.toggleAttach(actionType.BA_SENDONE_THREE_ONEBUILD, 'singleChanged', !controller.get('single'), 'buildingChanged', 'attachBuildingChanged')}
                            />
                        </WithLabel>
                        <WithLabel
                            label='房号'
                            rightText='室'
                            value={houseForm.get('door_num')}
                            placeholder={controller.get('villa')?'无':'输入房号'}
                            underlineColorAndroid = 'transparent'
                            editable={controller.get('villa')? false: true}
                            onBlur={() => ActionUtil.setAction(actionType.BA_SENDONE_THREE_ROOM)}
                            onChangeText={(v) => {this.singleAction('doorChanged', v.trim())}}
                        >
                            <Attached
                                isSelected={controller.get('villa')}
                                attachedText='无'
                                toggleAttach={() => this.toggleAttach(actionType.BA_SENDONE_THREE_VILLA, 'villaChanged', !controller.get('villa'), 'doorChanged', 'attachDoorChanged')}
                            />
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
                Alert.alert('', error.msg || '');
            })
        });

    }

    singleAction(action, value) {
        let {houseInput, actions} = this.props;

        houseInput.controller.get('err_msg') && actions.error('');
        actions[action](value);
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


        msg ? this.props.actions.error(errMsgs[msg]):this.submitSuccess(houseForm);
    };

    submitSuccess(params) {
        let {actions, navigator} = this.props;
        basicInventoryDuplicateService({body:params})
        .then(() => {
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
            ActionUtil.setActionWithExtend(actionType.BA_SENDONE_THREE_NEXT, {"error_type": error.status || ""});
            actions.error(error.msg);
        })
    }

    componentWillUnmount() {
        this.props.actions.baseCleared();
    }

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