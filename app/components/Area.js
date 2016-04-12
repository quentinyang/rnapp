'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio} from 'nuke';

export default class Area extends Component {
    constructor(props) {
        super(props);
        let {leftSelectId} = this.props;

        this.state = {
            leftSelectId: leftSelectId
        };
    }

    render() {
        let {data, rightSelectId, leftSelectId} = this.props;

        return (
            <View style={[styles.row, styles.flex, styles.pageBg]}>
                <LeftView
                    data={data}
                    mainIndex={this.state.leftSelectId}
                    onHandlePressItem={this._onHandlePressItem}
                />
                <RightView
                    ref='areaRightContainer' scrollViewRef='areaRightScrollView'
                    data={data}
                    mainIndex={this.state.leftSelectId}
                    mainName={this.state.leftSelectName}
                    leftSelectId={leftSelectId}
                    rightSelectId={rightSelectId}
                    blockFilterChanged={this.props.blockFilterChanged}
                />
            </View>
        );
    }

    _onHandlePressItem = (id, name) => {
        if (id != this.state.leftSelectId) {
            this.refs.areaRightContainer.refs.areaRightScrollView.scrollTo({x: 0, y: 0, animated: false});
            this.setState({
                leftSelectId: id,
                leftSelectName: name
            });
        }
    };
}

class LeftView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data, mainIndex} = this.props;

        let leftView = data.map((v) => {
            let selected = null, selectedText = null;
            if (mainIndex == v.get('id')) {
                selected = styles.selected;
                selectedText = styles.selectedText;
            }
            return (
                <TouchableWithoutFeedback key={v.get('id')} onPress={this._onHandlePress.bind(null, v.get('id'), v.get('name'))}>
                    <View style={[styles.justifyContent, styles.itemsHeight, styles.itemWrap, selected]}>
                        <Text style={[styles.text, selectedText]}>{v.get('name')}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        })

        return (
            <ScrollView style={[styles.leftView]} showsVerticalScrollIndicator={false}>
                {leftView}
            </ScrollView>
        )
    }

    _onHandlePress = (districtId, districtName) => {
        this.props.onHandlePressItem(districtId, districtName);
    };
}

class RightView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data, mainIndex, mainName, rightSelectId, leftSelectId} = this.props;
        let currData = data.find((d) => {
            return d.get('id') == mainIndex
        });

        let rightView = currData.get('blocks').map((d) => {
            let selectedText = null;
            if (leftSelectId == mainIndex && d.get('id') == rightSelectId) {
                selectedText = styles.selectedText;
            }
            return (
                <TouchableWithoutFeedback
                    key={d.get('id')}
                    onPress={this._onHandlePress.bind(null, mainIndex, d.get('id'), mainName, d.get('name'))}
                >
                    <View style={[styles.justifyContent, styles.itemsHeight]}>
                        <Text style={[styles.text, selectedText]}>{d.get('name')}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
        return (
            <ScrollView style={[styles.rightView]} ref='areaRightScrollView' showsVerticalScrollIndicator={false}>
                {rightView}
            </ScrollView>
        )
    }

    _onHandlePress = (districtId, blockId, dName, bName) => {
        let areaName = '';
        if (districtId != -1) {
            areaName = dName;
        }
        if (blockId != -1) {
            areaName = bName;
        }
        this.props.blockFilterChanged(districtId, blockId, areaName);
    };
}

const styles = StyleSheet.create({
    pageBg: {
        backgroundColor: '#fff'
    },
    row: {
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    leftView: {
        backgroundColor: '#f8f8f8',
        flex: 2
    },
    rightView: {
        marginLeft: 10,
        flex: 3
    },
    text: {
        fontSize: 15,
        color: '#3e3e3e',
        fontFamily: 'Heiti SC'
    },
    center: {
        alignItems:'center'
    },
    itemsHeight: {
        height: 40
    },
    itemWrap: {
        paddingLeft: 20
    },
    justifyContent: {
        justifyContent: 'center',
    },
    selected: {
        backgroundColor: '#fff',
    },
    selectedText: {
        color: '#04c1ae'
    }
});