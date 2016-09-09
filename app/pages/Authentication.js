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
    TouchableHighlight,
    InteractionManager
} from 'nuke';

import WithLabel from '../components/LabelTextInput';
import ErrorMsg from '../components/ErrorMsg';
import Pickers from '../components/Pickers';
import {qiniuUpload} from '../components/ImageSelected';
import TouchableSubmit from '../components/TouchableSubmit';
let commonStyle = require('../styles/main');
let ActionUtil = require('../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

var ImagePicker = require('react-native-image-picker');

var options = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '从手机相册选择',

    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class Authentication extends Component {
    constructor(props) {
        super(props);
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

    upCard(state) {
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else {
            let source = {};
            const img = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
            qiniuUpload(response.uri, this.success, this.error);
            // or a reference to the platform specific asset location
            if (Platform.OS === 'ios') {
              source = {uri: response.uri.replace('file://', '')};
            } else {
              source = {uri: response.uri};
            }
            let json = {};
            json[state] = source;

            this.setState(json);
          }
        });
    }

    success(data) {
        console.log('success',data);
    }

    error(data) {
        console.log('error', error);
    }

    handleSubmit() {
        upload(response.uri);
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
