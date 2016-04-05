'use strict';

import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
} from 'nuke';

export default class ErrorMsg extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {errBoxStyle, errTextStyle, errText} = this.props;
        return (
            <View style={[styles.errMsgBox, errBoxStyle]}>
                <Text style={[styles.errMsgText, errTextStyle]}>{errText}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    errMsgBox: {
        justifyContent: 'center',
        height: 25
    },
    errMsgText: {
        fontSize: 12,
        color: '#f00'
    }
});