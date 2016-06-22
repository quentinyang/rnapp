'use strict';
import { React, Component, View, ScrollView, Text, TextInput, Button, TouchableWithoutFeedback } from 'nuke'
import AsyncStorageComponent from '../utils/AsyncStorageComponent'
import * as commom from '../constants/Common'
import { replaceJSONContent } from '../utils/CommonUtils'
let RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

export default class ConfigHost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ghost: ghost,
            host: ghost
        };
    }

    render() {
        return (
            <View style={{padding: 10}}>

                <Text style={{marginTop: 10, fontSize: 14}}>当前分支:{this.state.ghost}</Text>
                <TextInput
                    style={{height: 30, marginBottom: 30, marginTop: 10, fontSize: 14}}
                    placeholder="如: http://feature-fy360.dev.angejia.com/service/"
                    onChangeText={(text) => {this.setState({host: text});}}
                    value={this.state.host}
                    onSubmitEditing={() => {}}
                />
                <Button
                    label="确定"
                    onPress={this._handleHost.bind(this)}
                />
            </View>

        );
    }
    _handleHost() {
        this.props.navigator.pop();
        let host = this.state.host;

        if(ghost !== host) {
            this.setState({
                ghost: host
            });
            AsyncStorageComponent.save(commom.API_HOST, host);
            RCTDeviceEventEmitter.emit(commom.HOST_CHANGE, host);
        }
    }
}