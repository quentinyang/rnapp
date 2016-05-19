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
    Dimensions,
    Linking,
    ScrollView
} from 'nuke';

import {inputHouseService} from '../service/houseInputService';
import Header from '../components/Header';
import WithLabel from '../components/LabelTextInput';
import ErrorMsg from '../components/ErrorMsg';
import TouchableSubmit from '../components/TouchableSubmit';
import CommunitySearch from '../components/SearchComponent';
import BaseInfoComponent from '../components/publishInventoryStep/BaseInfo';
import MoreInfoComponent from '../components/publishInventoryStep/MoreInfo';
import LandlordInfoComponent from '../components/publishInventoryStep/LandlordInfo';

import HouseInputSuccessContainer from '../containers/HouseInputSuccessContainer';
import TouchWebContainer from "../containers/TouchWebContainer";
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'


class FirstStep extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {houseForm, controller, communityData} = this.props;
        return (
            <View>
                {controller.get('search') ?
                    <CommunitySearch
                        placeholder='请输入小区名'
                        keyword={communityData.get('keyword')}
                        results = {communityData.get('results')}
                        actions = {this.props.actions}
                        onPress = {this.singleAction.bind(this)}
                    />
                    :
                    <BaseInfoComponent {...this.props} />
                }
            </View>
        )
    }
}
class HouseInput extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_SEND;
        ActionUtil.setActionWithExtend(actionType.BA_SEND_ONVIEW, {"bp": this.props.route.bp});
        this.height = Dimensions.get('window').height;
        this.state = {
            step: 1
        };
    }

    render() {
        let route = this.props.route;
        let {houseForm, controller, communityData} = this.props.houseInput,
            hideHeader = route && route.hideHeader;
        let CurrentComponent = '';

        switch(this.state.step) {
            case 1:
                CurrentComponent = <FirstStep {...this.props.houseInput}/>
                break;
            case 2:
                CurrentComponent = <MoreInfoComponent {...this.props.houseInput} />
                break;
            case 3:
                CurrentComponent = <LandlordInfoComponent {...this.props.houseInput} />
                break;
            default:
                CurrentComponent = <FirstStep {...this.props.houseInput} />
        }

        return (
            <View style={styles.container}>
                <Text><Text>3</Text>步立即发布房源</Text>
                <View style={styles.colorWhite}>
                    {CurrentComponent}
                </View>
                <TouchableHighlight><View><Text>下一步</Text></View></TouchableHighlight>
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

    inputFocused(actionLog, refName, top) {
        ActionUtil.setAction(actionLog);
        this.refs[refName].measure((x, y, width, height) => {
            if(this.height - 300 - top < y) {
                let h = y + 390 + top - this.height;
                this.refs.formContainer.refs.scrollView.scrollTo({x: 0, y: h, animated: true});
            }
        })
    }

    inputBlur() {
        let h = this.height > 640 ? 0: (640 - this.height);
        this.refs.formContainer.refs.scrollView.scrollTo({x: 0, y: h, animated: true});
    }

    linkFn = () => {
        ActionUtil.setAction(actionType.BA_SEND_POINTSRULE);
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
        ActionUtil.setAction(actionType.BA_SEND_FINISH);
        let actions = this.props.actions,
            houseForm = this.props.houseInput.houseForm.toJS(),
            msg = this.checkForm();

        msg ? this.props.actions.error(errMsgs[msg]):this.submitSuccess(houseForm);
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

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    layout: {
        flex: 1,
        backgroundColor: '#eee'
    },
    colorWhite: {
        backgroundColor: '#fff'
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