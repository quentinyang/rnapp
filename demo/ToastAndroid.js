'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
} = React;

var ToastExample = React.createClass({

  statics: {
    title: 'Toast Example',
    description: 'Example that demonstrates the use of an Android Toast to provide feedback.',
  },

  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
        <View style={styles.top}>
          <TouchableWithoutFeedback
            onPress={() =>
              ToastAndroid.show('This is a toast with short duration', ToastAndroid.SHORT)}>
            <Text style={styles.text}>Click me.</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              ToastAndroid.show('This is a toast with long duration', ToastAndroid.LONG)}>
            <Text style={styles.text}>Click me too.</Text>
          </TouchableWithoutFeedback>
        </View>
    );
  },
});

var styles = StyleSheet.create({
  top: {
    marginTop: 20,
  },
  text: {
    color: 'black',
  },
});

module.exports = ToastExample;