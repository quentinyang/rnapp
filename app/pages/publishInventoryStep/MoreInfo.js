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
        this.pageId = actionType.BA_SEND;
        ActionUtil.setActionWithExtend(actionType.BA_SEND_ONVIEW, {"bp": this.props.route.bp});
        this.height = Dimensions.get('window').height;
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
                        onPress={this.handleFirstSubmit}
                        submitText='下一步'
                    />
                </View>
            </View>
        );
    }

    singleAction(action, value) {
        this.props.actions[action](value);
    }

    handleFirstSubmit = () => {
        let houseForm = this.props.houseInput.houseForm.toJS();

        ActionUtil.setAction(actionType.BA_SEND_FINISH);
        this.submitSuccess(houseForm);
    };

    submitSuccess(params) {
        let {actions, navigator} = this.props;

        navigator.push({
            component: PublishThirdStepContainer,
            name: 'publishInventory',
            title: '房东信息',
            hideNavBar: false,
            bp: this.pageId
        });
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