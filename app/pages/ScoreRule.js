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

import HouseListContainer from '../containers/HouseListContainer';
import HouseInputContainer from '../containers/HouseInputContainer';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class ScoreRule extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_FIRSTOPEN;
        //ActionUtil.setActionWithExtend(actionType.BA_SEND_SUCCESS_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../images/success.png')} style={[styles.sucImg]}/>
                <Text style={styles.promptTitle}>恭喜你获得<Text style={styles.promptColor}>{this.props.route.score}</Text>积分</Text>

                <View style={{marginBottom: 45}}>
                    <Text style={[styles.baseColor, styles.lineSpace]}>积分怎么花:</Text>
                    <Text style={[styles.grayColor, styles.lineSpace]}>查看一次已认证房源的房东电话花<Text style={styles.promptColor}>4</Text>积分</Text>
                    <Text style={[styles.grayColor, styles.lineSpace, {marginBottom: 15}]}>查看一次待确认房源的房东电话花<Text style={styles.promptColor}>1</Text>积分</Text>

                    <Text style={[styles.baseColor, styles.lineSpace]}>如何赚积分:</Text>
                    <Text style={styles.grayColor}>发布一套房源可得<Text style={styles.promptColor}>7~15</Text>积分</Text>
                </View>

                <TouchableHighlight
                    style={[styles.sucButton, styles.backgroundGreen]}
                    underlayColor='#04c1ae'
                    onPress={this.lookHouse}
                >
                    <View><Text style={[styles.sucButtonText, styles.fontWhite]}>立即看房</Text></View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.sucButton, styles.backgroundWhite]}
                    underlayColor='#fff'
                    onPress={this.continueInput}
                >
                    <View><Text style={[styles.sucButtonText, styles.fontGreen]}>试试发房</Text></View>
                </TouchableHighlight>
            </View>
        )
    }

    continueInput = () => {
        ActionUtil.setAction(actionType.BA_FIRSTOPEN_SEND);
        this.props.navigator.push({
            component: HouseInputContainer,
            name: 'HouseInput',
            title: '发布房源',
            hideHeader: true,
            hideNavBar: false,
            bp: this.pageId
        });
    };

    lookHouse = () => {
        ActionUtil.setAction(actionType.BA_FIRSTOPEN_FIND);
        this.props.navigator.push({
            component: HouseListContainer,
            name: 'HouseList',
            title: '房源列表',
            hideNavBar: true,
            bp: this.pageId
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    baseColor: {
        color: "#3e3e3e"
    },
    sucImg: {
        marginTop: 45,
        marginBottom: 25,
        width: 70,
        height: 70
    },
    lineSpace: {
        marginBottom: 3
    },
    promptTitle: {
        fontSize: 19,
        fontWeight: '200',
        marginBottom: 35
    },
    promptColor: {
        color: '#fd9673'
    },
    grayColor: {
        color: '#8D8C92'
    },
    subPromptTitle: {
        marginTop: 10,
        marginBottom: 30,
        fontSize: 15,
        fontWeight: '200'
    },
    sucButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: 250,
        height: 40,
        borderWidth: 1,
        borderColor: '#04c1ae',
        borderRadius: 5
    },
    sucButtonText: {
        fontSize: 18
    },
    fontWhite: {
        color: '#fff'
    },
    fontGreen: {
        color: '#04c1ae'
    },
    fontOrange: {
        color: '#ffa251'
    },
    backgroundWhite: {
        backgroundColor: '#fff'
    },
    backgroundGreen: {
        backgroundColor: '#04c1ae'
    }
});