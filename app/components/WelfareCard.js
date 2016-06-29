'use strict';

import {
    React,
    Component,
    View,
    Text,
    Image,
    StyleSheet,
    PixelRatio
} from 'nuke';

export default class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {wrapStyle, errBoxStyle, errTextStyle, errText} = this.props;
        return (
            <Image source={require('../images/membership.png')} style={[styles.wfCaSection, styles.center, wrapStyle]} resizeMode='stretch'>
                <View style={styles.wfCaLeft}>
                    <Text style={styles.highFont}>2</Text><Text style={styles.font12}>积分</Text>
                </View>
                <View style={styles.wfSlice}></View>
                <View style={styles.wfCaDesc}>
                    <Text style={styles.fontBold}>看房卡</Text>
                    <Text style={styles.descFont} numberOfLines={1}>· 获任意1套房源的房东电话花1积分</Text>
                    <Text style={styles.descFont} numberOfLines={1}>· 有效期至2016-07-16</Text>
                </View>
                <View style={styles.wfBadge}>
                    <Image source={require('../images/expired.png')} style={styles.wfBadgeImg} />
                </View>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    wfCaSection: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        width: undefined,
        height: 78,
        backgroundColor: 'transparent'
    },
    wfCaLeft: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginRight: 10,
        marginLeft: 8
    },
    highFont: {
        fontSize: 25,
        color: '#ff6d4b'
    },
    font12: {
        fontSize: 12
    },
    wfSlice: {
        width: 0,
        height: 58,
        borderWidth: 1/PixelRatio.get(),
        borderStyle: 'dashed',
        borderColor: '#dedede'
    },
    wfCaDesc: {
        flex: 1,
        paddingLeft: 12,
    },
    fontBold: {
        fontWeight: '600'
    },
    descFont: {
        marginTop: 2,
        fontSize: 12,
        color: '#8d8c92'
    },

    wfBadge: {
        position: 'absolute',
        top: 19,
        right: 20
    },
    wfBadgeImg: {
        width: 40,
        height: 40,
        backgroundColor: '#f8f8f8'
    },
});