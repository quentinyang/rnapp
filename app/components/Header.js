'use strict';

import {
    React,
    Component,
    View,
    Text,
    PixelRatio,
    StyleSheet,
} from 'nuke';

export default class ErrorMsg extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {title, style, children} = this.props;
        return (
            <View style= {[styles.header, styles.center, style]}>
                <View style={[styles.title, styles.center]}>
                    <Text style={styles.titleFont}>{title}</Text>
                </View>
                {children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 65,
        paddingTop: 25,
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        backgroundColor: '#fff'
    },
    title: {
        flex: 1
    },
    titleFont: {
        fontSize: 19
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});