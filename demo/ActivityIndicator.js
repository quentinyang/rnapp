'use strict';

import {
    Component,
    React,
    StyleSheet,
    ActivityIndicator
} from 'nuke';

import {View, Text} from 'react-native';

export default class ActivityIndicatorDemo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={{margin:10}}>iOS进度指示器</Text>
                <View style={styles.horizontal}>
                    <ActivityIndicator color="#0000ff" animating={false}/>
                    <ActivityIndicator color="#aa00aa" size="large"/>
                    <ActivityIndicator color="#aa3300"/>
                    <ActivityIndicator color="#00aa00"/>
                </View>
                <View style={styles.column}>
                    <Text style={{margin:10}}>Android进度指示器</Text>
                    <ActivityIndicator styleAttr="Inverse" color="#aa00aa"/>
                    <ActivityIndicator styleAttr="Small" color="#0000ff"/>
                    <ActivityIndicator styleAttr="Large" color="#aa3300"/>
                    <ActivityIndicator styleAttr="SmallInverse" color="#00aa00"/>
                    <ActivityIndicator styleAttr="SmallInverse" color="red"/>
                    <ActivityIndicator styleAttr="SmallInverse" color="#00aa00"/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20
    },
    horizontal: {
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    column: {
        flex: 1,
        flexDirection: 'column',
    }
});