'use strict';

import {React, Component, Text, View, StyleSheet, PixelRatio, Modal, Picker, TouchableOpacity} from 'nuke';

import Dimensions from 'Dimensions';

var PickerItem = Picker.Item;

export default class Pickers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: this.props.options,
            labels: this.props.labels || this.props.options,
            selectedOption: this.props.options[0],
            modalVisible: false
        }
    }

    render() {
        return (
            <Modal
                animated={true}
                transparent={true}
                visible={this.state.modalVisible}>

                <View style={styles.basicContainer}>
                    <View style={styles.modalContainer}>
                        <View style={styles.buttonView}>
                            <TouchableOpacity onPress={() => {
                                    this.setState({modalVisible: false});
                                }}>
                                <Text>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                    if(this.props.onSubmit) this.props.onSubmit(this.state.selectedOption);
                                    this.setState({modalVisible: false});
                                }}>
                                <Text>确定</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.pickerBox}>
                            {/*Model body*/}
                            <Picker
                                ref={'picker1'}
                                style={styles.bottomPicker}
                                selectedValue={this.state.selectedOption}
                                onValueChange={(option) => this.setState({selectedOption: option})}
                                >
                                {this.state.options.map((option, i) => {
                                    var label = this.state.labels[i] || option;
                                    return (
                                        <PickerItem
                                            key={option}
                                            value={option}
                                            label={label}
                                        />
                                    )
                                })}
                            </Picker>
                            <Picker
                                ref={'picker2'}
                                style={styles.bottomPicker}
                                selectedValue={this.state.selectedOption}
                                onValueChange={(option) => this.setState({selectedOption: option})}
                                >
                                {this.state.options.map((option, i) => {
                                    var label = this.state.labels[i] || option;
                                    return (
                                        <PickerItem
                                            key={option}
                                            value={option}
                                            label={label}
                                        />
                                    )
                                })}
                            </Picker>
                        </View>

                    </View>
                </View>
            </Modal>
        )
    }

    show() {
        this.setState({modalVisible: true})
    }
}

var styles = StyleSheet.create({
    basicContainer:{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer:{
        width:Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        padding:0,
        backgroundColor: '#F5FCFF',
    },
    buttonView:{
        width:Dimensions.get('window').width,
        padding: 8,
        borderTopWidth:0.5,
        borderTopColor:'lightgrey',
        justifyContent: 'space-between',
        flexDirection:'row',
    },
    pickerBox: {
        flex: 1,
        flexDirection: 'row'
    },
    bottomPicker : {
        width:Dimensions.get('window').width/2,
    },
    mainBox: {
    }
});