'use strict';

import {
    React,
    Component,
    View,
    StyleSheet
} from 'nuke';

export default class PublishStepBlick extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {step} = this.props;
        return (
            <View style={styles.stepBox}>
                <View style={[styles.stepItem, step == 1 ? styles.stepSelected : null]}></View>
                <View style={[styles.stepItem, styles.stepInterval, step == 2 ? styles.stepSelected : null]}></View>
                <View style={[styles.stepItem, , step == 3 ? styles.stepSelected : null]}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    stepBox: {
        flexDirection: 'row',
        marginBottom: 15,
        height: 5,
        backgroundColor: '#fff'
    },
    stepItem: {
        flex: 1,
        backgroundColor: '#ccc'
    },
    stepInterval: {
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: '#fff'
    },
    stepSelected: {
        backgroundColor: '#04c1ae'
    },
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