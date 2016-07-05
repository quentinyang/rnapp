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
        let {wrapStyle, errBoxStyle, errTextStyle, errText, item} = this.props;
        return (
            <Image source={require('../images/membership.png')} style={[styles.wfCaSection, styles.center, wrapStyle]} resizeMode='stretch'>
                <View style={[styles.center, styles.wfCaLeft]}>
                    {item.get('cost') == 0 || !item.get('cost') ?
                    <Text style={[styles.highFont, {fontSize: 20}, item.get('status') != 1 ? styles.gray : null]}>{item.get('function') || '免费' }</Text>
                    :
                    <Text><Text style={[styles.highFont, item.get('status') != 1 ? styles.gray : null]}>{item.get('cost')}</Text><Text style={[styles.font12, item.get('status') != 1 ? styles.gray : null]}>积分</Text></Text>
                    }
                </View>
                <View style={styles.wfSlice}></View>
                <View style={styles.wfCaDesc}>
                    <Text style={[styles.fontBold, item.get('status') != 1 ? styles.gray : null]}>{item.get('name')}</Text>
                    <Text style={styles.descFont} numberOfLines={1}>· {item.get('brief')}</Text>
                    <Text style={styles.descFont} numberOfLines={1}>· 有效期至{item.get('end_at').substring(0, 10)}</Text>
                </View>
                <View style={styles.wfBadge}>
                    {item.get('status') == 2 ?
                    <Image source={require('../images/used.png')} style={styles.wfBadgeImg} />
                    : (
                        item.get('status') == 3 ?
                        <Image source={require('../images/expired.png')} style={styles.wfBadgeImg} />
                        :null
                      )
                    }
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
        marginLeft: -5,
        width: 70
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
    gray: {
        color: '#8d8c92'
    }
});