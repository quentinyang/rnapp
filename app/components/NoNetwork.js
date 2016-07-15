'use strict';

import {
    React,
    Component,
    View,
    Text,
    Image,
    StyleSheet
} from 'nuke';

export default class NoNetWork extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {style, onPress} = this.props;
        return (
            <View style={[styles.flex, styles.center]}>
                <Image source={require('../images/wifi.png')} style={[styles.wifi, style]} />
                <Text style={styles.lightGray}>网络不太顺畅</Text>
                <Text style={styles.lightGray} onPress={this.props.onPress}>点击刷新</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    wifi: {
        marginTop: -100,
        marginBottom: 12,
        width: 100,
        height: 70
    },
    lightGray: {
        color: '#8d8c92'
    }
});