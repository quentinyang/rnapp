'use strict';

import {
    React, Component,
    View, Text, Image, TextInput,
    StyleSheet, PixelRatio,
    TouchableHighlight, Alert, Dimensions
} from 'nuke';

import {inputHouseService} from '../../service/houseInputService';
import WithLabel from '../../components/LabelTextInput';
import PublishTitle from '../../components/PublishTitle';
import ErrorMsg from '../../components/ErrorMsg';
import TouchableSubmit from '../../components/TouchableSubmit';
import PublishThirdStepContainer from '../../containers/PublishThirdStepContainer';
let ActionUtil = require( '../../utils/ActionLog');
import * as actionType from '../../constants/ActionLog'

export default class MoreInfoPage extends Component {
    constructor(props) {
        super(props);
        ActionUtil.setAction(actionType.BA_SENDTWO_THREE_ONVIEW);
    }

    render() {
        let {houseForm, controller, communityData} = this.props.houseInput;
        let isOpacity = houseForm.get('bedrooms') && houseForm.get('living_rooms') && houseForm.get('bathrooms') && houseForm.get('area') && houseForm.get('price');

        return (
            <View style={styles.container}>
                <PublishTitle>还有<Text style={styles.colorFFDB}>2</Text>步即可发布</PublishTitle>
                <View style={styles.colorWhite}>
                    <WithLabel
                        label='户型'
                        rightText='室'
                        inputStyle={styles.alignCenter}
                        underlineColorAndroid = 'transparent'
                        keyboardType='numeric'
                        maxLength={2}
                        value={houseForm.get('bedrooms')}
                        onBlur={() => ActionUtil.setAction(actionType.BA_SENDTWO_THREE_LAYOUT)}
                        onChangeText={(v) => {this.singleAction('bedroomsChanged', v)}}
                    >
                        <TextInput
                            keyboardType='numeric'
                            style={[styles.inputBox, styles.alignCenter]}
                            maxLength={1}
                            underlineColorAndroid = 'transparent'
                            value={houseForm.get('living_rooms')}
                            onChangeText={(v) => {this.singleAction('livingroomsChanged', v)}}
                        />
                        <Text>厅</Text>
                        <TextInput
                            keyboardType='numeric'
                            style={[styles.inputBox, styles.alignCenter]}
                            maxLength={1}
                            underlineColorAndroid = 'transparent'
                            value={houseForm.get('bathrooms')}
                            onChangeText={(v) => {this.singleAction('bathroomsChanged', v)}}
                        />
                        <Text>卫</Text>
                    </WithLabel>
                    <WithLabel
                        label='面积'
                        ref='area'
                        rightText='平米'
                        maxLength={8}
                        keyboardType='numeric'
                        value={houseForm.get('area')}
                        placeholder='输入面积'
                        underlineColorAndroid = 'transparent'
                        onBlur={() => ActionUtil.setAction(actionType.BA_SENDTWO_THREE_AREA)}
                        onChangeText={(v) => {this.singleAction('areaChanged', v)}}
                    />
                    <WithLabel
                        label='价格'
                        ref='price'
                        rightText='万'
                        maxLength={6}
                        underlineColorAndroid = 'transparent'
                        keyboardType='numeric'
                        value={houseForm.get('price')}
                        placeholder='输入价格'
                        onBlur={() => ActionUtil.setAction(actionType.BA_SENDTWO_THREE_PRICE)}
                        onChangeText={(v) => {this.singleAction('priceChanged', v)}}
                    />
                </View>
                <ErrorMsg
                    errBoxStyle={{paddingLeft: 20}}
                    errText={controller.get('err_msg')}
                />
                <View style={styles.submitBox}>
                    <TouchableSubmit
                        opacity={isOpacity ? 1: 0.3}
                        onPress={this.handleSecondSubmit}
                        submitText='下一步'
                    />
                </View>
            </View>
        );
    }

    singleAction(action, value) {
        this.props.actions[action](value);
    }

    checkForm() {
        let houseForm = this.props.houseInput.houseForm.toJS();

        if(!parseInt(houseForm.area) || houseForm.area >= 1000000) {
            return 'wrongArea';
        }
        if(!parseInt(houseForm.price) || houseForm.price >= 1000000) {
            return 'wrongPrice';
        }
        return '';
    }


    handleSecondSubmit = () => {
        let houseForm = this.props.houseInput.houseForm.toJS(),
            msg = this.checkForm();

        ActionUtil.setAction(actionType.BA_SENDTWO_THREE_NEXT);
        msg ? this.props.actions.error(errMsgs[msg]):this.submitSuccess(houseForm);
    };

    submitSuccess(params) {
        let {actions, navigator} = this.props;
        actions.error('');
        navigator.push({
            component: PublishThirdStepContainer,
            name: 'publishInventory',
            log: {"cancel": actionType.BA_SENDTHREE_THREE_CANCEL, "ok": actionType.BA_SENDTHREE_THREE_ENSURE},
            title: '房东信息',
            backLog: actionType.BA_SENDTHREE_THREE_RETURN,
            confirm: true,
            hideNavBar: false,
        });
    }
}

const errMsgs = {
    'wrongArea': '所填面积超过限制面积',
    'wrongPrice': '价格过高'
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
    inputBox: {
        flex: 1,
        height: 45,
        fontSize: 15,
        fontWeight: '200',
        textAlign: 'center'
    },
    alignCenter: {
        textAlign: 'center'
    },
    submitBox: {
        paddingHorizontal: 20
    }
});