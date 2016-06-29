import {
    React,
    Component,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    Modal,
    Dimensions,
    PixelRatio,
    StyleSheet
} from 'nuke';

import Card from '../components/WelfareCard';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class Welfare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
    }

    render() {
        let tabs = ['未使用', '已使用', '已过期'];
        return (
            <View>
                <Wtabs current={this.state.current} tabs={tabs} onPress={this.tabClick} />
                {/*<NoCoupon current={this.state.current} tabs={tabs} />*/}
                <ScrollView style={styles.container}>
                    <Card wrapStyle={{marginBottom: 15}} />
                    <Card wrapStyle={{marginBottom: 15}} />
                </ScrollView>
            </View>
        );
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    tabClick = (index) => {
        if(index != this.state.current) {
            this.setState({current: index});
        }
    };
}

class Wtabs extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={[styles.tabSection, styles.center]}>
                {this.props.tabs.map((value, index) => {
                    return (
                        <TouchableHighlight onPress={() => this.props.onPress(index)} key={index} underlayColor='transparent'>
                            <View style={[styles.tabsItem, styles.center, this.props.current == index ? styles.tabsActive:{}]}>
                                <Text style={this.props.current == index ? styles.tabsFontActive: {}}>{value}</Text>
                            </View>
                        </TouchableHighlight>
                    );
                })}
            </View>
        );
    }
}

class NoCoupon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.noCouponBox, styles.center]}>
                <Image source={require('../images/coupon.png')}  style={styles.coupon} />
                <Text>您当前没有{this.props.tabs[this.props.current]}的福利卡</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 19,
        backgroundColor: '#fff'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabSection: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 25,
        height: 48,
        backgroundColor: '#f8f8f8'
    },
    tabsItem: {
        marginHorizontal: 25,
        paddingHorizontal: 5,
        height: 48
    },
    tabsActive: {
        height: 46,
        borderBottomWidth: 2,
        borderColor: '#ff6d4b',
    },
    tabsFontActive: {
        marginTop: 1,
        color: '#ff6d4b'
    },
    noCouponBox: {
        paddingVertical: 90
    },
    coupon: {
        marginBottom: 25,
        width: 100,
        height: 67
    }
});