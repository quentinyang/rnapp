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
        let {wrapStyle, leftFlex, icon, errBoxStyle, errTextStyle, errText, item, source} = this.props;
        let welfareBg;

        if(icon) {
            welfareBg = icon;
        } else {
            welfareBg = item.get('status') != 1 ? require('../images/welfare/welfare.png') : require('../images/welfare/welfare_available.png');
        }
        return (
            <Image source={welfareBg} style={[styles.wfCaSection, styles.center, wrapStyle]} resizeMode='stretch'>
                <View style={[styles.center, styles.wfCaLeft, {flex: leftFlex || 3}]}>
                    {item.get('type') == 2 ?
                    <Text style={[styles.highFont, {fontSize: 20}, item.get('status') != 1 ? styles.gray : null]}>补签</Text>:null}
                    {item.get('type') == 1 ?
                        item.get('cost') == 0 ?
                        <Text style={[styles.highFont, {fontSize: 20}, item.get('status') != 1 ? styles.gray : null]}>免费</Text>:
                        <Text><Text style={[styles.highFont, item.get('status') != 1 ? styles.gray : null]}>{item.get('cost')}</Text><Text style={[styles.font12, {color: '#ff6d4b'}, item.get('status') != 1 ? styles.gray : null]}>积分</Text></Text>
                    :null}
                </View>
                <View style={{flex: 10}}>
                <View style={styles.wfCaDesc}>
                    <Text style={[styles.fontBold, item.get('status') != 1 ? styles.gray : null]}>{item.get('name')}</Text>
                    <Text style={styles.descFont} numberOfLines={1}>· {item.get('brief') || '全平台通用'}</Text>
                    {item.get('end_at') ? <Text style={styles.descFont} numberOfLines={1}>· 有效期至{item.get('end_at').substring(0, 10)}</Text> : null}
                </View>
                </View>
                <View style={styles.wfBadge}>
                    {source ?
                        <Image source={source} style={styles.wfBadgeImg} />
                        :
                    (item.get('status') == 2 ?
                    <Image source={source ? source: require('../images/welfare/used.png')} style={styles.wfBadgeImg} />
                    : (
                        item.get('status') == 3 ?
                        <Image source={require('../images/welfare/expired.png')} style={styles.wfBadgeImg} />
                        :null
                      ))
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
    },
    highFont: {
        fontSize: 25,
        color: '#ff6d4b'
    },
    font12: {
        fontSize: 12
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
        backgroundColor: 'transparent'
    },
    gray: {
        color: '#8d8c92'
    }
});