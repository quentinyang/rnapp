'use strict';

import {
    React,
    Component,
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'nuke';

export default class TouchableSubmit extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {submitText, ...props} = this.props;
        return (
            <TouchableHighlight
                style={styles.submitButton}
                underlayColor='#04c1ae'
                {...props}
            >
                <View><Text style={styles.submitText}>{submitText}</Text></View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    submitButton: {
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5
    },
    submitText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    }
});