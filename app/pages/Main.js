'use strict';

import React from 'react-native';
const {
  StyleSheet,
  ListView,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  PropTypes,
  InteractionManager,
  ProgressBarAndroid,
  Image,
  DrawerLayoutAndroid,
  Dimensions,
  View,
  Platform
} = React;

var index = 0;

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    onPressDrawerItem(indexP) {
        this.props.actions.fetchTypes(index % 2 == 0)
        index = index + 1;
    }

    render() {
        let loading = this.props.test.get('loading');
        let text = loading ? '首页的了哦' : '我哪知道是哪个页面的哈'
        
        return (
            <TouchableOpacity
                style={styles.drawerContent}
                onPress={this.onPressDrawerItem.bind(this, index)}
            >
                <Text style={styles.drawerText}>
                    {text}
                </Text>
            </TouchableOpacity>
        )
    }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  title: {
    flex: 3,
    fontSize: 18,
    textAlign: 'left',
    color: 'black'
  },
  listView: {
    backgroundColor: '#eeeeec'
  },
  no_data: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100
  },
  drawerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  drawerIcon: {
    width: 30,
    height: 30,
    marginLeft: 5
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    textAlign: 'center',
    color: 'black'
  }
})

export default Main;