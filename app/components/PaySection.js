'use strict';

import {
    React,
    Component,
    View,
    Text,
    Image,
    PixelRatio,
    StyleSheet
} from 'nuke';

export default class PaySection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {price} = this.props;
        return (
            <View style={styles.payWay}>
                <View style={styles.payLeft}>
                    <Image source={require('../images/alipaylogo.png')} style={styles.aliImage} />
                    <Text>支付宝支付: <Text style={styles.colorRed}>{price}元</Text></Text>
                </View>
                <Image source={require('../images/paySelected.png')} style={styles.payWayImage} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    payWay: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1/PixelRatio.get(),
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9'
    },
    payLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    colorRed: {
        color: '#ff6d4b'
    },
    aliImage: {
        marginRight: 8,
        width: 27,
        height: 27
    },
    payWayImage: {
        width: 21,
        height: 21
    },
});