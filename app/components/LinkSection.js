'use strict';

import {
    React,
    Component,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback
} from 'nuke';

export default class LinkSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {linkStyle, iconBoxStyle, icon, children, onPress} = this.props;
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.linkSection, styles.row, linkStyle]}>
                    <View style={[styles.linkIconBox, styles.center, iconBoxStyle, {backgroundColor: icon.bgColor}]}>
                        <Image
                            style={icon.style}
                            source={icon.url}
                        />
                    </View>
                    <View style={[styles.flex, styles.row]}>{children}</View>
                    <Image
                        source={require('../images/next.png')}
                        style={styles.arrow}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
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
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    linkSection: {
        paddingHorizontal: 15,
        height: 55,
        backgroundColor: '#fff'
    },
    linkIconBox: {
        marginRight: 10,
        width: 23,
        height: 23,
        borderRadius: 11.5
    },
    arrow: {
        width: 9,
        height: 18,
        marginLeft: 10
    }
});