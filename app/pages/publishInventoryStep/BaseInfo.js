'use strict';

import {
    React, Component,
    View, Text, Image, StyleSheet,
    PixelRatio,
    TouchableHighlight, Alert, Dimensions
} from 'nuke';

import {basicInventoryDuplicateService} from '../../service/houseInputService';
import WithLabel from '../../components/LabelTextInput';
import Attached from '../../components/Attached';
import PublishTitle from '../../components/PublishTitle';
import ErrorMsg from '../../components/ErrorMsg';
import TouchableSubmit from '../../components/TouchableSubmit';
import CommunitySearch from '../../components/SearchComponent';
import PublishSecondStepContainer from '../../containers/PublishSecondStepContainer';
let ActionUtil = require( '../../utils/ActionLog');
import * as actionType from '../../constants/ActionLog'

export default class BaseInfoPage extends Component {
    constructor(props) {
        super(props);
        ActionUtil.setActionWithExtend(actionType.BA_SENDONE_THREE_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {houseForm, controller, communityData} = this.props.houseInput;
        let isOpacity = !!(houseForm.get('community_name') && (controller.get('single')? true: houseForm.get('building_num')) && (controller.get('villa')?true:houseForm.get('door_num')));

        return (
            <View style={styles.container}>
            {controller.get('search') ?
                <View style={styles.colorWhite}>
                <CommunitySearch
                    placeholder='请输入小区名'
                    keyword={communityData.get('keyword')}
                    results = {communityData.get('results')}
                    actions = {this.props.actions}
                    onPress = {this.singleAction.bind(this)}
                />
                </View>
                :
                <View>
                    <PublishTitle><Text style={styles.colorFFDB}>3</Text>步立即发布房源</PublishTitle>
                    <View style={styles.colorWhite}>
                        <WithLabel
                            label='小区'
                            special={true}
                            specialText1={houseForm.get('community_name')}
                            specialText2={houseForm.get('address')}
                            arrow={true}
                            onClick={() => {ActionUtil.setAction(actionType.BA_SEND_ADDCOM); this.singleAction('searchChanged', true)}}
                        />
                        <WithLabel
                            label='楼栋'
                            rightText='号/座'
                            rightStyle={controller.get('single')? {color: '#fff'}: {}}
                            value={houseForm.get('building_num')}
                            placeholder={controller.get('single')?'':'输入楼/座号'}
                            editable={controller.get('single')? false: true}
                            underlineColorAndroid = 'transparent'
                            onFocus={() => ActionUtil.setAction(actionType.BA_SEND_ADDBUILDINGNUM)}
                            onChangeText={(v) => {this.singleAction('buildingChanged', v)}}
                        >
                            <Attached
                                isSelected={controller.get('single')}
                                attachedText='独栋'
                                toggleAttach={() => this.toggleAttach(actionType.BA_SENDONE_THREE_ONEBUILD, 'singleChanged', !controller.get('single'), 'buildingChanged', 'attachBuildingChanged')}
                            />
                        </WithLabel>
                        <WithLabel
                            label='房号'
                            rightText='室'
                            rightStyle={controller.get('villa')? {color: '#fff'}: {}}
                            value={houseForm.get('door_num')}
                            placeholder={controller.get('villa')?'':'输入房号'}
                            underlineColorAndroid = 'transparent'
                            editable={controller.get('villa')? false: true}
                            onChangeText={(v) => {this.singleAction('doorChanged', v)}}
                        >
                            <Attached
                                isSelected={controller.get('villa')}
                                attachedText='别墅'
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
            }
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
                log: {"cancel": actionType.BA_SENDTWO_THREE_CANCEL, "ok": actionType.BA_SENDTWO_THREE_ENSURE},
                title: '更多房源信息',
                backLog: actionType.BA_SENDTWO_THREE_RETURN,
                confirm: true,
                hideNavBar: false,
            });
            ActionUtil.setAction(actionType.BA_SENDONE_THREE_NEXT);
        })
        .catch((error) => {
            ActionUtil.setActionWithExtend(actionType.BA_SENDONE_THREE_NEXT, {"error_type": error.status || ""});
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
    submitBox: {
        paddingHorizontal: 20
    }
});