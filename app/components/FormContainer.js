import {React, Component, Text, View, ScrollView, StyleSheet, ListView, Image, PixelRatio,
            TouchableWithoutFeedback, RefreshControl, InteractionManager, ActivityIndicator,
            WebView, Alert} from 'nuke';

import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

var TextInputState = require('TextInputState');

export default class FormContainer extends Component {

  render() {
    return (
              <ScrollView
                    ref={this.props.scrollViewRef}
                    showsVerticalScrollIndicator={true}
                    automaticallyAdjustContentInsets={false}
                    contentContainerStyle={styles.content}
                    keyboardDismissMode='none'
                    keyboardShouldPersistTaps={true}>
                    <View
                      onStartShouldSetResponderCapture={(e) => {
                        const focusField = TextInputState.currentlyFocusedField();

                        // console.log(e.nativeEvent, e.nativeEvent.target, focusField)

                        if (focusField != null && e.nativeEvent.target != focusField){
                          dismissKeyboard();
                        }

                      }}>
                      {this.props.children}
                    </View>
              </ScrollView>

            );
  }
}

const styles = StyleSheet.create({
    default: {
      height: 26,
      borderWidth: 0.5,
      borderColor: '#0f0f0f',
      flex: 1,
      fontSize: 13,
      padding: 4,
    },
});