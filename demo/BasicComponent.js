'use strict';

import React, {
    Component,
    StyleSheet,
} from 'react-native';

import {View, Text, Image, Switch, MapView} from 'nuke-native';

export default class BasicComponentsDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loading: false,
            progress: 0,
            trueSwitchIsOn: true,
            falseSwitchIsOn: false
        };
    };

    render() {
        var loader = this.state.loading ?
            <View style={styles.progress}>
                <Text>{this.state.progress}%</Text>
            </View>: null;

        return (
            <View style={styles.top}>
                <View>
                    <Text style={styles.mark}>//onPress</Text>
                    <Text style={styles.text} onPress={this.handleText.bind(this)}>Hello World.</Text>
                    <Text style={styles.mark}>//numberOfLines:子元素超过显示...,父元素要为Text</Text>
                    <Text numberOfLines={2} style={{width: 100}}><Text>123456789012345678901234567890</Text></Text>
                    <Text style={styles.mark}>//下面两个例子表示父元素为View使用flex布局，若为Text则为行内</Text>
                    <Text>First part and</Text>
                    <Text>second part</Text>
                    <Text>
                        <Text>First part and</Text>
                        <Text>second part</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.mark}>//thumbTintColor: 切换的按钮的颜色；onTintColor: 打开的背景色；tintColor: 关闭的背景色。</Text>
                    <Text style={styles.mark}>//onValueChange: 改变状态触发的函数。disabled:true,不可切换。value:true/false,true为打开。</Text>
                    <Switch
                        onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                        style={{marginBottom: 10}}
                        disabled={false}
                        thumbTintColor={'#000'}
                        onTintColor={'#f00'}
                        tintColor={'#ccc'}
                        value={this.state.falseSwitchIsOn} />
                    <Switch
                        onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
                        value={this.state.trueSwitchIsOn} />
                </View>
                <MapView
                    style={styles.map}
                />
                <Image
                    source={{uri: 'http://facebook.github.io/react/img/logo_og.png'}}
                    style={styles.img}
                    onLoadStart={this.imgStart}
                    onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
                    onProgress={(e) => this.setState({progress: Math.round(100*e.nativeEvent.loaded/e.nativeEvent.total)})}
                    onLoad={() => this.setState({loading: false, error: false})}>
                    {loader}
                </Image>
                <Image
                    source={require('./1.jpg')}
                    style={styles.img}
                />
            </View>
        );     
    };
    handleText(e) {
        alert('xx');
    };
    handleViewTap(e) {
        alert('aaa');
    };
    handleViewDoubleTap(e) {
        alert('bbb');
    };
    imgStart = (e) => {
        this.setState({loading: true})
    };
}

const styles = StyleSheet.create({
    top: {
        marginTop: 20
    },
    text: {
        fontSize: 26,
        marginRight: 10,
        color: 'red'
    },
    mark: {
        fontSize: 12,
        color: '#666',
    },
    viewHeight: {
        height: 150,
        backgroundColor: '#007fff',
    },
    img: {
        width: 400,
        height: 400,
        borderWidth: 10,
        borderColor: '#f00',
        borderRadius: 3
    },
    map: {
        height: 150,
        margin: 10,
        borderWidth: 1,
        borderColor: '#000000',
    }
});