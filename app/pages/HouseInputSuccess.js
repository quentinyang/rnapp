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

export default class HouseInputSuccess extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../images/success.png')} style={[styles.sucImg]}/>
                <Text style={styles.promptTitle}>审核通过可获<Text style={styles.promptColor}>15</Text>积分</Text>
                <Text style={styles.subPromptTitle}>1个工作日内完成审核</Text>
                <TouchableHighlight
                    style={[styles.sucButton, styles.backgroundGreen]}
                    underlayColor='#04c1ae'
                    onPress={this.handleSubmit}
                >
                    <Text style={[styles.sucButtonText, styles.fontWhite]}>继续发房</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.sucButton, styles.backgroundWhite]}
                    underlayColor='#04c1ae'
                    onPress={this.handleSubmit}
                >
                    <Text style={[styles.sucButtonText, styles.fontGreen]}>查看房源</Text>
                </TouchableHighlight>
            </View>
        )
    }

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
    backgroundWhite: {
        backgroundColor: '#fff'
    },
    backgroundGreen: {
        backgroundColor: '#04c1ae'
    }
});