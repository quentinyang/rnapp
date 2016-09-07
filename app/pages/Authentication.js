'use strict';

import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    Image,
    Alert,
    PixelRatio,
    Platform,
    StyleSheet,
    InteractionManager
} from 'nuke';

import WithLabel from '../components/LabelTextInput';
import ErrorMsg from '../components/ErrorMsg';
import Pickers from '../components/Pickers';
import TouchableSubmit from '../components/TouchableSubmit';
let commonStyle = require('../styles/main');
let ActionUtil = require('../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class Authentication extends Component {
    constructor(props) {
        super(props);
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

        return (
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
                        otherStyle={styles.borderBottom}
                    />
                    <UploadCard
                        label='上传身份证'
                        labelDesc='身份证正面朝上'
                    />
                </View>
                <ErrorMsg
                    errBoxStyle={{paddingLeft: 20}}
                    errText={''}
                />
                <View style={styles.submitBox}>
                    <TouchableSubmit
                        opacity={0.3}
                        onPress={this.handleSubmit}
                        submitText='提交'
                    />
                </View>
            </ScrollView>
        );
    }

    componentDidMount() {
    }

    singleAction(action, value) {
        let {actions} = this.props;

        actions[action](value);
    }

    handleSubmit() {

    }

    confirmModal = (d) => {
        let data = {
            district_id: d[0].id,
            district_name: d[0].name,
            block_id: d[1].id,
            block_name: d[1].name
        };
        this.singleAction('workAddrChanged', data);
        this.singleAction('addrPickerChanged', false);
    }
}

class UploadCard extends Component {
    render() {
        let {otherStyle} = this.props;
        return (
            <View style={[commonStyle.flex, commonStyle.row, styles.cardBox, otherStyle]}>
                <View style={styles.cardLeft}>
                    <Text>{this.props.label}</Text>
                    <Text style={commonStyle.smallFt}>{this.props.labelDesc}</Text>
                </View>
                <View style={[commonStyle.center, styles.addBox]}>
                    <Image
                        source={require('../images/add.png')}
                        style={styles.addImg}
                    />
                </View>
            </View>
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
    addImg: {
        width: 30,
        height: 30
    },
    submitBox: {
        paddingHorizontal: 20
    }
});
