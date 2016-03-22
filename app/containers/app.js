'use strict';

import React, {Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text} from 'react-native';
import {NaviGoBack} from '../utils/CommonUtils';
import Splash from '../pages/Splash';

let _navigator, isRemoved = false;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.renderScene = this.renderScene.bind(this);
        this.goBack = this.goBack.bind(this);
        // this.navBar = this.navBar.bind(this);
        // this._LeftButton = this._LeftButton.bind(this);
        // this._RightButton = this._RightButton.bind(this);
        // this._Title = this._Title.bind(this);

        // BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    }

    configureScene(route, routeStack) {
        return Navigator.SceneConfigs.PushFromRight;
    }

    goBack() {
        // return NaviGoBack(_navigator);
    }

    renderScene(route, navigator) {
        let Component = route.component;

        // _navigator = navigator;

        // if(route.name === 'WebViewPage') {
        //     BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
        //     isRemoved = true;
        // } else {
        //     if(isRemoved) {
        //         BackAndroid.addEventListener('hardwareBackPress', this.goBack);
        //     };
        // }

        return (
            <Component navigator={navigator} route={route} />
        );
    }

    navBar() {

        let a = <Navigator.NavigationBar
                    routeMapper={{
                        LeftButton: this._LeftButton,
                        RightButton: this._RightButton,
                        Title: this._Title
                    }}
                    style={styles.navBar}
                />;


        return a;
    }

    _LeftButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Text>Left</Text>
            </TouchableOpacity>
        );
    }

    _RightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Text>Right</Text>
            </TouchableOpacity>
        );
    }

    _Title(route, navigator, index, navState) {
        return (
            <Text>{ route.yitle }</Text>
        )
    }

    render() {
        let aa = <Navigator.NavigationBar
                    routeMapper={this.navBar()}
                    style={styles.navBar}
                />;

        return (
            <Navigator
                style={styles.navigator}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
                sceneStyle={{backgroundColor: '#fff'}}
                initialRoute={{
                    component: Splash,
                    name: 'Splash',
                    yitle: 'Test'
                }}
                navigationBar={aa}
            />
        )
    }
}

let styles = StyleSheet.create({
    navigator: {
        flex: 1
    },
    navBar: {
        flex: 1,
        backgroundColor:'#fff',
        borderColor:'orange',
        borderWidth:1,
        height: (Platform.OS === 'ios') ? 64: 48
    },
    navBarLeftButton: {
        paddingLeft: 5
    },
    icon: {
        width:30,
        height:30,
        marginTop:(Platform.OS === 'ios')? 6: 9,
        textAlign:'center'
    }
});

export default App;

/*'use strict';

import React, {Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text} from 'react-native';
import {NaviGoBack} from '../utils/CommonUtils';
import Splash from '../pages/Splash';

var App = React.createClass({

  renderScene: function( route, nav ) {
    let Componented = route.component

    switch (route.name) {
      case 'Splash':
        return <Componented/>
      case 'PageTwo':
        return <Splash navigator={ nav } leftButton={ "Back" } title={ "PageTwo" } />;
    }
  },

  LeftButton: function( route, navigator, index, navState ){
    return(
      <Text>{ route.leftButton }</Text>
    )
  },
  Title: function( route, navigator, index, navState ){
    return(
      <Text>{ route.title }</Text>
    )
  },
  RightButton: function( route, navigator, index, navState ){
    return(
      <Text>{ route.rightButton }</Text>
    )
  },

  render: function() {
    return (
      <Navigator
        style={{flex: 1}}
        initialRoute={{
            component: Splash,
            name: 'Splash',
            title: 'Test'
        }}
        renderScene={ this.renderScene }
        configureScene={( route ) => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        navigationBar={
          <Navigator.NavigationBar
            style={{
                flex: 1,
                backgroundColor:'#fff',
                borderColor:'orange',
                borderWidth:1,
                height: (Platform.OS === 'ios') ? 64: 48
            }}
            routeMapper={{
                LeftButton: this.LeftButton,
                Title: this.Title,
                RightButton: this.RightButton
            }} 
          />
        } 
      />
    );
  },
});

export default App;*/