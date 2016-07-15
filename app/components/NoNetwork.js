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
            <View style={[styles.netWrap, styles.center, style]}>
                <Image source={require('../images/wifi.png')} style={styles.wifi} />
                <Text style={styles.lightGray}>网络不太顺畅</Text>
                <Text style={styles.lightGray} onPress={this.props.onPress}>点击刷新</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    netWrap: {
        flex: 1,
        marginTop: -100
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    wifi: {
        marginBottom: 12,
        width: 100,
        height: 70
    },
    lightGray: {
        color: '#8d8c92'
    }
});