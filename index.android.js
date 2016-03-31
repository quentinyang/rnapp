'use strict';

import React, {AppRegistry, StyleSheet} from 'react-native';
import Immutable, {List} from 'immutable'
// import {
//     React,
//     Component,
//     StyleSheet,
//     Navigator,
//     TouchableOpacity,
//     Image, View, Text, ListView
// } from 'nuke';

// import PickerDemo from './demo/Picker';
// import PickerIOSDemo from './demo/PickerIOS';
// import AlertDemo from './demo/Alert';
// import BasicComponentsDemo from './demo/BasicComponent';
// import RefreshControlDemo from './demo/RefreshControl'
// import TabBarDemo from './demo/TabBar'
import Root from './app/root';
import Tab from './app/components/Tab';
// import ToastDemo from './demo/ToastAndroid';

// import codePush from "react-native-code-push";

let oData = Immutable.fromJS([
    {
        "id": 5,
        "name": "徐汇",
        "blocks": [
            {
                "id": 39,
                "name": "淮海西路"
            },
            {
                "id": 40,
                "name": "淮海东路"
            }
        ]
    },
    {
        "id": 6,
        "name": "闵行",
        "blocks": [
            {
                "id": 49,
                "name": "莘庄"
            },
            {
                "id": 50,
                "name": "春申"
            }
        ]
    },
    {
        "id": 7,
        "name": "松江",
        "blocks": [
            
        ]
    },
    {
        "id": 8,
        "name": "长宁",
        "blocks": [
            
        ]
    },
    {
        "id": 9,
        "name": "浦东",
        "blocks": [
            
        ]
    },
    {
        "id": 11,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 12,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 13,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 14,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 15,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 16,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 17,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 18,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 19,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 20,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 21,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 22,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 23,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 24,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 25,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 26,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 27,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 28,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 29,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 30,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 31,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 32,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 33,
        "name": "普陀",
        "blocks": [
            
        ]
    },
    {
        "id": 34,
        "name": "普陀",
        "blocks": [
            
        ]
    }
]);

let selectedArr = Immutable.fromJS([
        {
            "id": 39,
            "name": "淮海西路"
        },
        {
            "id": 40,
            "name": "淮海东路"
        }
]);


class fy360 extends React.Component {
  componentDidMount() {
    // download silently and installed the next time the app is restarted
    // codePush.sync({rollbackTimeout: 3000});
    // Prompt the user when an update is available, 
    // if aggree, and then display a "downloading" modal, and update immediately
    // codePush.sync({updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE, rollbackTimeout: 3000});
  }

  // render() {
  //   var Picker1 = PickerIOSDemo.examples[0].render;
  //   var Picker2 = PickerIOSDemo.examples[1].render;
  //   return (
  //       <View style={styles.container}>
  //           <Text style={styles.welcome}>
  //             Welcome to React Native!
  //           </Text>
  //           <Image source={require('./rn/image/flower.jpg')}  style={{width: 200, height: 200}}/>
  //           <Text style={styles.instructions}>
  //             To get started, edit index.ios.js
  //           </Text>
  //           <Text style={styles.instructions}>
  //             Press Cmd+R to reload,{'\n'}
  //             Cmd+D or shake for dev menu
  //           </Text>
  //           <ToastDemo />
  //           <AlertDemo />
  //           <Picker1 />
  //           <Picker2 />
  //           <PickerDemo />
  //           <BasicComponentsDemo />
  //           <RefreshControlDemo />
  //       </View>
  //   );
  // }

    render() {
        return (
            <Root />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    }
});

AppRegistry.registerComponent('fy360', () => fy360);
