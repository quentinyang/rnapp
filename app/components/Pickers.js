'use strict';

import {React, Component, Text, View, StyleSheet, PixelRatio, Modal, Picker, TouchableOpacity} from 'nuke';

import Dimensions from 'Dimensions';

var PickerItem = Picker.Item;

export default class Pickers extends Component {
    constructor(props) {
        super(props);

        let {options, visible, num, selectedOption} = this.props;
        this.state = {
            modalVisible: visible
        }
        for(let i = 0; i < num; i++) {
            this.state['selectedOption' + i] = selectedOption[i];
        }
        this.allData = {};
        this.handleData(options, 0);
    }

    render() {
        console.log('===============Father=================');

        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {}}>

                <View style={styles.basicContainer}>
                    <View style={styles.modalContainer}>
                        <View style={styles.buttonView}>
                            <TouchableOpacity onPress={() => this.cancelModal()}>
                                <View><Text>取消</Text></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.sureModal()}>
                                <View><Text>确定</Text></View>
                            </TouchableOpacity>
                        </View>
                        <PickerContent
                            data={this.allData}
                            num={this.props.num}
                            valueChanged={this.valueChanged}
                            {...this.state}
                         />
                    </View>
                </View>
            </Modal>
        )
    }

    handleData(options, index, id = '') {
        let allData = this.allData, key = '';
        if(id != '') {
            key = 'section_'+index+'_'+id;
        } else {
            key = 'section_'+index;
        }
        allData[key] = [];
        for(let i = 0, opt_length = options.length; i < opt_length; i++) {
            let obj = options[i];
            let keys = Object.keys(obj);

            if(keys.length == 3) {
                allData['section_'+(index + 1)+'_'+obj.id] = [];
                for(var j = 0, key_length = keys.length; j < key_length; j++) {
                    if(keys[j] != 'id' && keys[j] != 'name') {
                        var arr_next = obj[keys[j]];
                        if(Object.keys(arr_next[0]).length == 2) {
                            allData['section_'+(index + 1)+'_'+obj.id] = arr_next;
                        } else {
                            this.handleData(arr_next, index + 1, obj.id);
                        }
                    }
                }
                var eachData = {
                    id: obj.id,
                    name: obj.name
                };
                allData[key].push(eachData);
            }

        }
    }

    valueChanged = (option, index) => {
        let select = 'selectedOption' + index;
        var json = {};
        json['selectedOption' + index] = option;
        this.setState(json);
    };

    cancelModal() {
        this.props.cancel();
    }

    sureModal() {
        let {num} = this.props;
        let data = [];
        for(let i = 0; i < num; i++) {
            let key = '';
            if(i == 0) {
                key = 'section_0';
            } else {
                key = 'section_' + i + '_' + this.state['selectedOption' + (i - 1)];
            }
            for(let j = 0; j < this.allData[key].length; j++) {
                let itemData = this.allData[key][j];
                if(itemData.id == this.state['selectedOption' + i]) {
                    data.push(itemData);
                }
            }
        }

        this.props.confirm(data);
        this.setState({modalVisible: false});
    }
}

class PickerContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('====================Child======================');
        let {data, num} = this.props;
        let picker = [];

        for(let i = 0; i < num; i++) {
            let key = '';
            let pickerItem = [];
            if(i == 0) {
                key = 'section_0';
            } else {
                key = 'section_' + i + '_' + this.props['selectedOption' + (i - 1)];
            }
            for(let j = 0; j < data[key].length; j++) {
                let itemData = data[key][j];
                pickerItem.push(<PickerItem value={itemData.id} label={itemData.name} key={itemData.id} />)
            }
            picker.push(
                <Picker
                    style={{width: Dimensions.get('window').width/num}}
                    selectedValue={this.props['selectedOption' + i]}
                    onValueChange={(option) => {this.props.valueChanged(option, i)}}
                    key={i}
                >
                    {pickerItem}
                </Picker>
            );

        }

        return (
            <View style={styles.pickerBox}>
                {picker}
            </View>
        );
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
    }
});

