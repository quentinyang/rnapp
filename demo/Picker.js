'use strict';

import React, {
    Component,
    StyleSheet,
    PickerIOS,
} from 'react-native';

import {View, Text, Image, Switch, MapView, Picker} from 'nuke-native';

export default class PickerDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: ''
        }
    };

    render() {
        return (
            <View>
                <Text style={[styles.mark, styles.top]}>//enabled在Android有效，在iOS中无效。</Text>
                <Text style={styles.mark}>//Picker,iOS和Android通用。</Text>
                <Text style={styles.mark}>//PickerIOS在iOS中有效，在Android中报错。</Text>
                <Picker
                    selectedValue={this.state.language}
                    onValueChange={(lang) => this.setState({language: lang})} enabled={false}>
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                </Picker>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    top: {
        marginTop: 10,
    },
    mark: {
        fontSize: 12,
        color: '#666',
    },
});