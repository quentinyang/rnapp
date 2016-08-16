'use strict';

import {
    React,
    Component,
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Image
} from 'nuke';

import InputHouseContainer from '../containers/InputHouseContainer';
import PublishFirstStepContainer from '../containers/PublishFirstStepContainer';
import InputHouseRule from '../pages/InputHouseRule';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class HouseInputSuccess extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_SEND_SUCCESS;
        ActionUtil.setActionWithExtend(actionType.BA_SEND_SUCCESS_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {appConfig} = this.props;
        let {data} = this.props.route;

        return (
            <View style={styles.container}>
                <Image source={require('../images/success.png')} style={[styles.sucImg]}/>

                {
                    appConfig.get('isNewModal') ? <Text style={styles.sucButtonText}>发布成功！</Text>
                    :
                    <Text style={styles.promptTitle}>审核通过可获<Text style={styles.promptColor}>{data.money}</Text>积分和<Text style={styles.promptColor}>{data.experience}</Text>个经验</Text>
                }

                {data.is_special ? <Text style={[styles.promptTitle, styles.fontOrange]}>{data.msg}</Text>:null}

                {data.is_can_input ?
                <TouchableHighlight
                    style={[styles.sucButton, styles.backgroundGreen]}
                    underlayColor='#04c1ae'
                    onPress={this.continueInput}
                >
                    <View><Text style={[styles.sucButtonText, styles.fontWhite]}>继续发房</Text></View>
                </TouchableHighlight>
                :null
                }
                {
                    appConfig.get('isNewModal') ?
                    <View style={styles.ruleBox}>
                        <Text style={styles.grayColor}>发房规则：</Text>
                        <Text style={styles.grayColor}>1、发布房源的电话每被查看1次获得<Text style={styles.fontOrange}>{data.money}</Text>积分</Text>
                        <Text style={styles.grayColor}>2、每套房源审核通过，平台补贴<Text style={styles.fontOrange}>{data.looked_point}</Text>积分</Text>
                        <Text style={[styles.ruleSub, styles.grayColor]}>（补贴只是暂时的，之后会有调整）</Text>
                        <Text style={styles.grayColor}>3、房源审核通过，得<Text style={styles.fontOrange}>{data.experience}</Text>经验</Text>
                    </View> : null
                }
            </View>
        )
    }

    continueInput = () => {
        ActionUtil.setAction(actionType.BA_SEND_SUCCESS_CONTINIUE);
        this.props.navigator.pop();
    };

    lookHouse = () => {
        ActionUtil.setAction(actionType.BA_SEND_SUCCESS_ALLHOUSE);
        this.props.navigator.replace({
            component: InputHouseContainer,
            name: 'InputHouse',
            title: '发布的房源',
            hideNavBar: false,
            backLog: actionType.BA_MINE_RELEASE_RETURN,
            bp: this.pageId
        });
    };

    componentDidMount() {}

    componentWillUnmount() {}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    sucImg: {
        marginTop: 80,
        marginBottom: 25,
        width: 80,
        height: 80
    },
    promptTitle: {
        marginBottom: 10,
        fontSize: 15,
        fontWeight: '200'
    },
    promptColor: {
        color: '#fd9673'
    },
    sucButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 15,
        width: 250,
        height: 40,
        borderWidth: 1,
        borderColor: '#04c1ae',
        borderRadius: 5
    },
    sucButtonText: {
        fontSize: 19
    },
    fontWhite: {
        color: '#fff'
    },
    fontOrange: {
        color: '#FF845D'
    },
    backgroundGreen: {
        backgroundColor: '#04c1ae'
    },
    ruleBox: {
        marginLeft: 62,
        marginTop: 25,
        marginRight: 32
    },
    grayColor: {
        color: '#8d8c92',
        marginTop: 3
    },
    ruleSub: {
        fontSize: 14
    }
});