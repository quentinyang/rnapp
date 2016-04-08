'use strict';

import {React, Component, View, StyleSheet, WebView} from 'nuke';

export default class TouchWeb extends Component {
    constructor(props) {
        super(props);
        
        this.state = {};
    }
    render() {
      var WEBVIEW_REF = 'webview';

      var url =  this.props.route.url + '?token=' + gtoken
      console.log('[WebView]', url);
      return (
            <View style={styles.layout}>
                <WebView
                  ref={WEBVIEW_REF}
                  automaticallyAdjustContentInsets={false}
                  style={styles.webView}
                  source={{uri: url}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  decelerationRate="normal"
                  onNavigationStateChange={this.onNavigationStateChange}
                  onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                  startInLoadingState={true}
                  scalesPageToFit={this.state.scalesPageToFit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        height: 500,
    },
    webView: {

    }
});