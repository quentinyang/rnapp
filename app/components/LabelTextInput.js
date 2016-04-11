'use strict';

import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    PixelRatio
} from 'nuke';

export default class LabelTextInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {ref, label, special, specialText1, specialText2, onClick, inputStyle, arrow, rightText, rightStyle, placeholderTextColor, children, ...props} = this.props;

        return (
            <View
                ref={ref}
                style={styles.inputContainer}
            >
                <Text style={styles.label}>{label}</Text>
                {!special ?
                    <TextInput
                        style={[styles.inputBox, inputStyle]}
                        placeholderTextColor={placeholderTextColor || '#ccc'}
                        {...props}
                    />:
                    <TouchableOpacity
                        style={styles.specialTouch}
                        onPress={onClick}
                    >
                    {!specialText1?
                        <View style={styles.specialView}>
                        <Text style={[styles.specialText, styles.specialDefaultColor]}>
                            选择小区
                        </Text>
                        </View>:
                        <View style={styles.specialView}>
                        <Text style={styles.specialText}>
                            {specialText1}
                        </Text>
                        <Text style={[styles.specialText, styles.specialAttach]}>
                            {specialText2}
                        </Text>
                        </View>
                    }
                    </TouchableOpacity>
                }
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
        width: 80,
        fontSize: 16,
        color: '#3e3e3e'
    },
    specialTouch: {
        flex: 1,
        justifyContent: 'center',
        height: 45
    },
    specialText: {
        fontSize: 15,
        color: '#000'
    },
    specialDefaultColor: {
        color: '#ccc'
    },
    inputBox: {
        flex: 1,
        marginLeft: 0,
        paddingLeft: 0,
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
    specialView: {
        flex: 1,
        justifyContent: 'center'
    },
    specialAttach: {
        fontSize: 12,
        color: '#8d8c92'
    }
});