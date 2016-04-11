import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    TextInput,
    PixelRatio,
    Linking,
    ScrollView
} from 'nuke';

import {inputHouseService} from '../service/houseInputService';
import Header from '../components/Header';
import WithLabel from '../components/LabelTextInput';
import ErrorMsg from '../components/ErrorMsg';
import TouchableSubmit from '../components/TouchableSubmit';
import CommunitySearch from '../components/SearchComponent';
import HouseInputSuccessContainer from '../containers/HouseInputSuccessContainer';
import FormContainer from '../components/FormContainer';
import TouchWebContainer from "../containers/TouchWebContainer";

class HouseInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {houseForm, controller, communityData} = this.props.houseInput;

        var hideHeader =  this.props.route && this.props.route.hideHeader;
        return (
            <View style={styles.container}>
            {controller.get('search') ?
                <CommunitySearch
                    placeholder='请输入小区名'
                    keyword={communityData.get('keyword')}
                    results = {communityData.get('results')}
                    actions = {this.props.actions}
                    onPress = {this.singleAction.bind(this)}
                />
                :
                <View style={styles.layout}>
                    {
                        hideHeader == true ? null :
                        (<Header title='发布房源'>
                            <Text style={styles.headerRight} onPress={this.linkFn}>积分规则</Text>
                        </Header>)
                    }

                    <FormContainer
                        ref="formContainer"
                        scrollViewRef="scrollView"
                        style={styles.container}
                        automaticallyAdjustContentInsets={false}
                    >
                    <View style={styles.formBox}>
                        <WithLabel
                            label='小区'
                            special={true}
                            specialText1={houseForm.get('community_name')}
                            specialText2={houseForm.get('address')}
                            arrow={true}
                            onClick={() => this.singleAction('searchChanged', true)}
                        />
                        <WithLabel
                            label='楼栋'
                            rightText='号/座'
                            rightStyle={controller.get('single')? {color: '#fff'}: {}}
                            value={houseForm.get('building_num')}
                            placeholder={controller.get('single')?'':'输入楼/座号'}
                            editable={controller.get('single')? false: true}
                            underlineColorAndroid = 'transparent'
                            onChangeText={(v) => {this.singleAction('buildingChanged', v)}}
                        >
                            <Attached
                                isSelected={controller.get('single')}
                                attachedText='独栋'
                                toggleAttach={() => this.toggleAttach('singleChanged', !controller.get('single'), 'buildingChanged', 'attachBuildingChanged')}
                            />
                        </WithLabel>
                        <WithLabel
                            label='单元'
                            value={houseForm.get('unit_num')}
                            placeholder={controller.get('no_unit')?'':'输入单元号'}
                            editable={controller.get('no_unit')? false: true}
                            underlineColorAndroid = 'transparent'
                            onChangeText={(v) => {this.singleAction('unitChanged', v)}}
                        >
                            <Attached
                                isSelected={controller.get('no_unit')}
                                attachedText='无'
                                toggleAttach={() => this.toggleAttach('noUnit', !controller.get('no_unit'), 'unitChanged')}
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
                                toggleAttach={() => this.toggleAttach('villaChanged', !controller.get('villa'), 'doorChanged', 'attachDoorChanged')}
                            />
                        </WithLabel>
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
                            onFocus={() => this.inputFocused('area')}
                            onBlur={() => this.inputFocused('area', 0)}
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
                            onFocus={() => this.inputFocused('price')}
                            onBlur={() => this.inputFocused('price', 0)}
                            onChangeText={(v) => {this.singleAction('priceChanged', v)}}
                        />
                    </View>
                    <View style={styles.formBox}>
                        <WithLabel
                            label='称呼'
                            ref='alias'
                            value={houseForm.get('seller_alias')}
                            placeholder='(选填)如张先生'
                            onFocus={() => this.inputFocused('alias')}
                            underlineColorAndroid = 'transparent'
                            onBlur={() => this.inputFocused('alias', 0)}
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
                            onFocus={() => this.inputFocused('phone')}
                            onBlur={() => this.inputFocused('phone', 0)}
                            onChangeText={(v) => {this.singleAction('phoneChanged', v)}}
                        />
                    </View>
                    <ErrorMsg
                        errBoxStyle={{paddingLeft: 20}}
                        errText={controller.get('err_msg')}
                    />
                    <View style={styles.submitBox}>
                        <TouchableSubmit
                            onPress={this.handleSubmit}
                            submitText='完成'
                        />
                    </View>
                    </FormContainer>
                </View>
            }
            </View>
        );
    }

    singleAction(action, value) {
        this.props.actions[action](value);
    }

    toggleAttach(action, value, secAction, thirdAction) {
        if(value) {
            this.singleAction(secAction, '');
            if(thirdAction) {
                this.singleAction(thirdAction, 1);
            }
        }

        this.singleAction(action, value);
    }

    inputFocused(refName, height) {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            let scrollResponder = this.refs.formContainer.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                React.findNodeHandle(this.refs[refName]),
                height || 110,
                true
            );
        }, 50);
    }

    linkFn = () => {
        let {navigator} = this.props;

        let url = 'http://mp.weixin.qq.com/s?__biz=MzAxNDYyMTA0NQ==&mid=401036326&idx=1&sn=45548dc3dfb63021c4e60df9058df5df#rd';
        navigator.push({
            component: TouchWebContainer,
            name: 'score rule',
            title: '积分规则',
            url: url
        });
    };

    handleSubmit = () => {
        let actions = this.props.actions,
            houseForm = this.props.houseInput.houseForm.toJS(),
            msg = this.checkForm();

        msg ? this.props.actions.error(errMsgs[msg]):this.submitSuccess(houseForm);
    };

    submitSuccess(params) {
        let {actions, navigator} = this.props;

        inputHouseService({body:params})
        .then((oData) => {
            navigator.push({
                component: HouseInputSuccessContainer,
                name: 'houseInputSuccess',
                title: '发布成功',
                data: oData,
                hideNavBar: false
            });
            actions.dataCleared();
        })
        .catch((error) => {
            actions.error(error.msg);
        })
    }

    checkForm() {
        let houseForm = this.props.houseInput.houseForm.toJS(),
            controller = this.props.houseInput.controller.toJS(),
            regwords =  /楼|幢|栋|号|室/g,
            regphone = /^1\d{10}$|^0\d{10,11}$|^\d{8}$/g;

        if(!controller.single && !houseForm.community_id) {
            return 'emptyCommunity';
        }
        if(!controller.single && !houseForm.building_num) {
            return 'emptyBuilding';
        }
        if(!controller.no_unit && !houseForm.unit_num) {
            return 'emptyUnit';
        }
        if(!controller.villa && !houseForm.door_num) {
            return 'emptyDoor';
        }
        if(!(houseForm.bedrooms && houseForm.living_rooms && houseForm.bathrooms)) {
            return 'emptyHx';
        }
        if(!houseForm.area) {
            return 'emptyArea';
        }
        if(!houseForm.price) {
            return 'emptyPrice';
        }
        if(!houseForm.seller_phone) {
            return 'emptyPhone';
        }
        if(regwords.test(houseForm.building_num)) {
            return 'wrongBuilding';
        }
        if(regwords.test(houseForm.door_num)) {
            return 'wrongDoor';
        }
        if(!parseInt(houseForm.area) || houseForm.area >= 1000000) {
            return 'wrongArea';
        }
        if(!parseInt(houseForm.price) || houseForm.price >= 1000000) {
            return 'wrongPrice';
        }
        if(!regphone.test(houseForm.seller_phone)) {
            return 'wrongPhone';
        }
        return '';
    }

    componentWillUnmount() {
        this.props.actions.dataCleared();
    }
}

let errMsgs = {
    'emptyCommunity': '请选择小区',
    'emptyBuilding': '请输入楼栋号',
    'wrongBuilding': '请输入正确的楼栋号',
    'emptyUnit': '请确认有无单元号，有请输入，无请勾选“无”',
    'emptyDoor': '请输入房号',
    'wrongDoor': '请输入正确的房号',
    'emptyHx': '请补全户型信息',
    'emptyArea': '请输入面积',
    'wrongArea': '所填面积超过限制面积',
    'emptyPrice': '请输入价格',
    'wrongPrice': '价格过高',
    'emptyPhone': '请输入联系电话',
    'wrongPhone': '联系电话有误'
}

class Attached extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
                <TouchableHighlight
                    style={styles.attachedTouch}
                    underlayColor='#fff'
                    onPress={this.props.toggleAttach}
                >
                    <View style={[styles.attached]}>
                        {this.props.isSelected ?
                            <Image
                                source={require('../images/selected.png')}
                                style={styles.selectedImage}
                            /> :
                            <Image
                                source={require('../images/unSelected.png')}
                                style={styles.selectedImage}
                            />
                        }
                        <Text style={styles.attachedText}>{this.props.attachedText}</Text>
                    </View>
                </TouchableHighlight>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    layout: {
        flex: 1,
        backgroundColor: '#eee'
    },
    headerRight: {
        marginLeft: -80,
        marginRight: 15,
        width: 65,
        fontSize: 15,
        color: '#04c1ae',
        justifyContent: 'flex-end'
    },
    formBox: {
        marginTop: 15,
        borderTopWidth:1/PixelRatio.get(),
        borderTopColor: '#d9d9d9',
        backgroundColor: '#fff'
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
    attachedTouch: {
        marginLeft: 35
    },
    attached: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 55
    },
    attachedText: {
        paddingTop: 1,
        fontSize: 15,
        fontWeight: '200'
    },
    selectedImage: {
        width: 17,
        height: 17,
        marginRight: 5
    },
    submitBox: {
        marginBottom: 80,
        paddingLeft: 25,
        paddingRight: 25
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HouseInput;