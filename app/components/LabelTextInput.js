'use strict';

import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    PixelRatio
} from 'nuke';

export default class LabelTextInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {ref, label, inputStyle, arrow, rightText, rightStyle, placeholderTextColor, children, ...props} = this.props;

        return (
            <View
                ref={ref}
                style={styles.inputContainer}
            >
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={[styles.inputBox, inputStyle]}
                    placeholderTextColor={placeholderTextColor ? placeholderTextColor : '#ccc'}
                    {...props}
                />
                {arrow ?
                    <Image
                        source={require('../images/next.png')}
                        style={styles.arrow}
                    />:
                    <Text style={[styles.rightText, rightStyle]}>{this.props.rightText}</Text>
                }
                {children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        paddingLeft: 20,
        paddingRight: 15,
        height: 45,
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    label: {
        width: 90,
        fontSize: 16,
        color: '#3e3e3e'
    },
    inputBox: {
        flex: 1,
        height: 45,
        fontSize: 15,
        fontWeight: '200'
    },
    arrow: {
        width: 9,
        height: 18
    },
    rightText: {
        fontSize: 15,
        fontWeight: '200'
    },
});