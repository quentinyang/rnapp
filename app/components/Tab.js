'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, Image, PixelRatio, TouchableWithoutFeedback, Alert} from 'nuke';

export default class Tab extends Component {
    constructor(props) {
        super(props);

        let {dataArr, leftSelectId} = this.props;
        let leftSelectObject = dataArr.first();

        this.state = {
            leftSelectId: leftSelectId || leftSelectObject.get('id')
        };
    }

    render() {
        let {dataArr, selectedArr, maxSelected} = this.props;
        console.log('Tab.js ', selectedArr.toJS())
        return (
            <View style={styles.container}>
                <View style={[styles.row, styles.flex]}>
                    <LeftView
                        data={dataArr}
                        mainIndex={this.state.leftSelectId}
                        onHandlePressItem={this.onHandlePressLeftItem}
                        selectedArr={selectedArr}
                    />
                    <RightView
                        ref='tabRightContainer' scrollViewRef='tabRightScrollView'
                        data={dataArr}
                        mainIndex={this.state.leftSelectId}
                        maxSelected={maxSelected}
                        onHandlePressItem={this.onHandlePressRightItem}
                        selectedArr={selectedArr}
                    />
                </View>
            </View>
        )
    }

    onHandlePressLeftItem = (id) => {
        if (id != this.state.leftSelectId) {
            this.refs.tabRightContainer.refs.tabRightScrollView.scrollTo({x: 0, y: 0, animated: false});
            this.setState({
                leftSelectId: id
            })
        }
    };

    onHandlePressRightItem = (block, insert:boolen) => {
        this.props.onHandleBlockSelected(block, insert);
    };
}

class LeftView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data, mainIndex, selectedArr} = this.props;
        let leftView = data.map((d, i) => {
            let selected = null;
            if (mainIndex == d.get('id')) {
                selected = styles.selected;
            }
            let blocks = d.get('blocks');
            let includeItem = selectedArr.filter((s) => {
                let status = false;
                blocks.map((b) => {
                    if (s.get('id') == b.get('id')) {
                        status = true;
                        return;
                    }
                });
                if (status == true) {
                    return true;
                }
            });

            return (
                <TouchableWithoutFeedback key={d.get('id')} onPress={this._onHandlePress.bind(null, d.get('id'))}>
                    <View style={[styles.flex, styles.row, {alignItems: "center"}, styles.itemWrap, styles.itemsHeight, selected]}>
                        <Text style={[styles.leftRow]}>
                            {d.get('name') + ' '}
                        </Text>
                        {
                            includeItem.size > 0 ? <Image
                                source={require('../images/dot.png')}
                                style={styles.dotImage}
                            /> : null
                        }
                    </View>
                </TouchableWithoutFeedback>
            );
        });
        return (
            <ScrollView style={[styles.flex, styles.leftView]} showsVerticalScrollIndicator={false}>
                {leftView}
            </ScrollView>
        )
    }

    _onHandlePress = (id) => {
        this.props.onHandlePressItem(id);
    };
}

class RightView extends Component {
    constructor(props) {
        super(props);
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
                <TouchableWithoutFeedback
                    key={d.get('id')}
                    style={[styles.leftRow]}
                    onPress={this._onHandlePress.bind(null, d, isSelected ? false : true)}
                >
                    <View style={[styles.flex, styles.row, styles.center, styles.itemsHeight]}>
                        <Text style={[styles.leftRow, styles.flex]}>{d.get('name')}</Text>
                        {isSelected ? 
                            <Image
                                source={require('../images/selected.png')}
                                style={styles.selectedImage}
                            /> :
                            <Image
                                source={require('../images/unSelected.png')}
                                style={styles.selectedImage}
                            />
                        }
                    </View>
                </TouchableWithoutFeedback>
            )
        });
        return (
            <ScrollView ref='tabRightScrollView' style={[styles.rightView]} showsVerticalScrollIndicator={false}>
                {rightView}
            </ScrollView>
        )
    }

    _onHandlePress = (block, insert:boolen) => {
        let {maxSelected, selectedArr} = this.props;

        if (insert && selectedArr.size == maxSelected) {
            Alert.alert(null, '最多能设置' + maxSelected + '个关注的板块', [{text: '确定'}]);
        } else {
            this.props.onHandlePressItem(block, insert)
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 1/PixelRatio.get(),
        borderBottomWidth: 1/PixelRatio.get(),
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
    center: {
        alignItems:'center'
    },
    leftRow: {
        fontSize: 14,
        color:'#7C7C7C',
    },
    selectedImage: {
        width: 21,
        height: 21,
        marginRight: 30
    },
    itemsHeight: {
        height: 50,
        paddingLeft: 10
    },
    itemWrap: {
        paddingLeft: 10
    },
    dotImage: {
        width: 8,
        height: 8,
        marginTop: -4
    }
});