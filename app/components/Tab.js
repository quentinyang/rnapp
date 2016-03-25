'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet} from 'nuke';


export default class Tab extends Component {
    constructor(props) {
        super(props);

        let {dataArr, selectedArr, leftSelectId} = this.props;
        let leftSelectObject = dataArr.first();

        this.state = {
            dataArr: dataArr,            // 所有展示的数据
            selectedArr: selectedArr,        // 所有被选中的数据
            maxSelected: 3,         // 最多选择几个
            leftSelectId: leftSelectId || leftSelectObject.get('id')      // 主菜单选中的id
        };

        this.onHandlePressLeftItem = this.onHandlePressLeftItem.bind(this);
        this.onHandlePressRightItem = this.onHandlePressRightItem.bind(this);
    }

    render() {
        let {dataArr} = this.props;

        return (
            <View style={styles.container}>
                <View style={[styles.row, styles.flex]}>
                    <LeftView
                        data={dataArr}
                        mainIndex={this.state.leftSelectId}
                        onHandlePressItem={this.onHandlePressLeftItem}
                    />
                    <RightView 
                        data={dataArr}
                        mainIndex={this.state.leftSelectId}
                        onHandlePressItem={this.onHandlePressRightItem}
                        selectedArr={this.state.selectedArr}
                    />
                </View>
            </View>
        )
    }

    onHandlePressLeftItem(id) {
        this.setState({
            leftSelectId: id
        })
    }

    onHandlePressRightItem(block, insert:boolen) {
        let newSelectArr;
        let {selectedArr, maxSelected} = this.state;

        if (insert && selectedArr.count() <  maxSelected) {
            newSelectArr = this.state.selectedArr.push(block)
        } else if (!insert) {
            newSelectArr = this.state.selectedArr.filter((b) => {
                return block.get('id') != b.get('id')
            })
        } else {
            return;
        }

        this.setState({
            selectedArr: newSelectArr
        })
    }
}

class LeftView extends Component {
    constructor(props) {
        super(props);

        this._onHandlePress = this._onHandlePress.bind(this);
    }

    render() {
        let {data, mainIndex} = this.props;
        let leftView = data.map((d, i) => {
            let selected = null;
            if (mainIndex == d.get('id')) {
                selected = styles.selected;
            }
            return (
                <Text style={[styles.leftRow, selected]}
                      key={d.get('id')}
                      onPress={this._onHandlePress.bind(null, d.get('id'))}>
                  {d.get('name')}
                </Text>
            );
        });
        return (
            <ScrollView style={[styles.flex, styles.leftView]} showsVerticalScrollIndicator={false}>
                {leftView}
            </ScrollView>
        )
    }

    _onHandlePress(id) {
        this.props.onHandlePressItem(id);
    }
}

class RightView extends Component {
    constructor(props) {
        super(props);

        this._onHandlePress = this._onHandlePress.bind(this)
    }

    render() {
        let {data, mainIndex, selectedArr} = this.props;
        let currData = data.find((d) => {
            return d.get('id') == mainIndex
        });

        let rightView = currData.get('blocks').map((d, i) => {

            let isSelected = selectedArr.find((selected) => {
                return selected.get('id') == d.get('id')
            });

            return (
                <View key={d.get('id')} style={[styles.flex, styles.row]}>
                    <Text style={[styles.leftRow, styles.flex]}>{d.get('name')}</Text>
                    <Text 
                        style={[styles.leftRow, {width: 60, textAlign: 'center'}]}
                        onPress={this._onHandlePress.bind(null, d, isSelected ? false : true)}
                    >
                        {isSelected ? 1 : 0}
                    </Text>
                </View>
            )
        });
        return (
            <ScrollView style={[styles.rightView]} showsVerticalScrollIndicator={false}>
                {rightView}
            </ScrollView>
        )
    }

    _onHandlePress(block, insert:boolen) {
        this.props.onHandlePressItem(block, insert)
    }
}

const styles = StyleSheet.create({
    container: {
        height: 240,
        flex: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    row: {
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    leftView: {
        backgroundColor: '#F2F2F2'
    },
    selected: {
        backgroundColor: '#fff'
    },
    rightView: {
        marginLeft: 10,
        flex: 2
    },
    // center: {
    //     justifyContent:'center',
    //     alignItems:'center'
    // },
    leftRow: {
        paddingLeft: 10,
        height: 50,
        lineHeight: 30,
        fontSize: 14,
        color:'#7C7C7C',
    }
});