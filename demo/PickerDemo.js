'use strict';

import {React, Component, Text, View} from 'nuke';

import Pickers from "../components/Pickers";

export default class PickerDemo extends Component {
    constructor(props) {
        super(props);
        this.state ={
            huxing: ''
        };
    }

    render() {
        var options = ['Option1', 'Option2', 'Option3'];
        var labels = ['hello', 'world', 'Foodmate'];

        return (
            <View>
                <Text style={{marginTop: 100}} onPress={this.pressFn}>{this.state.huxing? this.state.huxing:'点击点击啦'}</Text>
                <Pickers ref='picker' options={options} labels={labels} onSubmit={(value) => this.submitFn(value)} />
            </View>
        )
    }

    pressFn = () => {
        this.refs.picker.show();
    };

    submitFn = (value) => {
        this.setState({
            huxing: value
        });
    };
}