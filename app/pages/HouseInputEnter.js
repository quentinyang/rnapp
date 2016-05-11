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

import Header from '../components/Header';
import HouseInputContainer from '../containers/HouseInputContainer';
import TouchWebContainer from "../containers/TouchWebContainer";
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

class HouseInputEnter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let route = this.props.route;
        let hideHeader = route && route.hideHeader;
        return (
            <View style={styles.container}>
                {
                    hideHeader == true ? null :
                    (<View><Header title='发布房源' style={{backgroundColor: '#f8f8f8'}}>
                        <Text style={styles.headerRight} onPress={this.linkFn}>积分规则</Text>
                    </Header><View style={{marginTop: -60}}></View></View>)
                }
                <View style={[styles.container, styles.center]}>
                    <TouchableHighlight underlayColor='transparent' onPress={this.gotoInput}>
                        <Image
                            style={styles.houseIcon}
                            source={require("../images/release_house_btn.png")}
                        />
                    </TouchableHighlight>
                    <Text style={styles.houseAnnotation}>发房得<Text style={styles.houseScore}>7~15</Text>积分</Text>
                </View>
            </View>
        );
    }

    gotoInput = () => {
        ActionUtil.setAction(actionType.BA_SEND_SENDBUTTON);
        this.props.navigator.push({
            component: HouseInputContainer,
            name: 'houseInput',
            title: '发布房源',
            hideNavBar: false
        });
    };

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

    componentWillUnmount() {
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerRight: {
        marginLeft: -80,
        marginRight: 15,
        width: 65,
        fontSize: 15,
        color: '#04c1ae',
        justifyContent: 'flex-end'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    houseIcon: {
        width: 165,
        height: 165,
    },
    houseAnnotation: {
        marginVertical: 30,
        fontSize: 16,
        color: '#8d8c92'
    },
    houseScore: {
        fontWeight: 'bold',
        color: '#ff6d4b'
    }
})

export default HouseInputEnter;