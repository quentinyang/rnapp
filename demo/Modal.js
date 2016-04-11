'use strict';
import React from 'react-native';

import { Modal, Button, Component, StyleSheet, View } from 'nuke'

export default class ModalDemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
    }

    _setVisible(tmp) {
        this.setState({
            visible: tmp
        });
    }

    render() {
        //visible, onModalVisibilityChanged is required
        return (
            <View>
                <Modal visible={this.state.visible} onModalVisibilityChanged={this._setVisible.bind(this)}>
                    <Button label="hide" onPress={this._setVisible.bind(this, false)} />
                </Modal>
                <Button label="show" onPress={this._setVisible.bind(this, true)} />
            </View>
        );
    }
}

