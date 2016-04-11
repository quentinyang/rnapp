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

export default class HouseInputSuccess extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data} = this.props.route;

        return (
            <View style={styles.container}>
                <Image source={require('../images/success.png')} style={[styles.sucImg]}/>
                <Text style={styles.promptTitle}>审核通过可获<Text style={styles.promptColor}>{data.money}</Text>积分</Text>
                <Text style={!data.is_special?styles.subPromptTitle:[styles.subPromptTitle, styles.fontOrange]}>{data.msg}</Text>
                <TouchableHighlight
                    style={[styles.sucButton, styles.backgroundGreen]}
                    underlayColor='#04c1ae'
                    onPress={this.continueInput}
                >
                    <Text style={[styles.sucButtonText, styles.fontWhite]}>继续发房</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.sucButton, styles.backgroundWhite]}
                    underlayColor='#04c1ae'
                    onPress={this.lookHouse}
                >
                    <Text style={[styles.sucButtonText, styles.fontGreen]}>查看房源</Text>
                </TouchableHighlight>
            </View>
        )
    }

    continueInput = () => {
        this.props.navigator.pop();
    };

    lookHouse = () => {
        this.props.navigator.replace({
            component: InputHouseContainer,
            name: 'InputHouse',
            title: '发布的房源',
            hideNavBar: false
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
        fontSize: 19,
        fontWeight: '200'
    },
    promptColor: {
        color: '#fd9673'
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