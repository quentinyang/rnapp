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
            host: ghost,
            version: gver
        };
    }

    render() {
        return (
            <View>
                 <View style={{padding: 10}}>

                    <Text style={{marginTop: 10, fontSize: 14}}>当前分支:{this.state.host}</Text>
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

                <View style={{padding: 10}}>

                    <Text style={{marginTop: 10, fontSize: 14}}>当前Version:{this.state.version}</Text>
                    <TextInput
                        style={{height: 50, marginBottom: 30, marginTop: 10, fontSize: 14}}
                        placeholder="如: 2.0.0"
                        onChangeText={(text) => {this.setState({version: text});}}
                        value={this.state.version}
                        onSubmitEditing={() => {}}
                    />
                    <Button
                        label="确定"
                        onPress={this._handleVersion.bind(this)}
                    />
                </View>
            </View>
        );
    }
    _handleHost() {
        this.props.navigator.pop();
        let host = this.state.host;

        if(ghost !== host) {
            AsyncStorageComponent.save(commom.API_HOST, host).catch((error) => {console.log(error)});
            RCTDeviceEventEmitter.emit(commom.HOST_CHANGE, host);
        }
    }

    _handleVersion() {
        this.props.navigator.pop();
        let version = this.state.version;

        if(gver !== version) {
            AsyncStorageComponent.save(commom.APP_VERSION, version).catch((error) => {console.log(error)});
            gver = version;
        }
    }
}