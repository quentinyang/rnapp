'use strict';

import {
    React,
    Component,
    View,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet,
} from 'nuke';

export default class PublishTitle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                <View style={[styles.headerPrompt, styles.verticalCenter]}>
                    <Text style={styles.titleFont}>{this.props.children}</Text>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    alignCenter: {
        alignItems: 'center'
    },
    verticalCenter: {
        justifyContent: 'center'
    },
    headerPrompt: {
        height: 30,
        paddingHorizontal: 20
    },
    titleFont: {
        fontSize: 12,
        color: '#8d8c92'
    },
    colorFFDB: {
        color: '#ff6d4b'
    },
});