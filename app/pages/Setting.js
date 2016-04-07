import {React, Component, Text, View, ScrollView, StyleSheet, ListView, Image, PixelRatio,
        TouchableWithoutFeedback, RefreshControl, InteractionManager, ActivityIndicator, WebView} from 'nuke';


class Setting extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            url: 'https://api.fangyuan360.cn/usercenter/account/?token=' + gtoken
        };
    }

    render() {
        var WEBVIEW_REF = 'webview'
        return (
            <View style={styles.layout}>
                <WebView
                  ref={WEBVIEW_REF}
                  automaticallyAdjustContentInsets={false}
                  style={styles.webView}
                  source={{uri: this.state.url}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  decelerationRate="normal"
                  onNavigationStateChange={this.onNavigationStateChange}
                  onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                  startInLoadingState={true}
                  scalesPageToFit={this.state.scalesPageToFit}
                />

            </View>
            

        )
    }
}

class Withdraw extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            url: 'https://api.fangyuan360.cn/usercenter/account/?token=' + gtoken
        };
    }

    render() {
        var WEBVIEW_REF = 'webview'
        return (
            <View style={styles.layout}>
                <WebView
                  ref={WEBVIEW_REF}
                  automaticallyAdjustContentInsets={false}
                  style={styles.webView}
                  source={{uri: this.state.url}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  decelerationRate="normal"
                  onNavigationStateChange={this.onNavigationStateChange}
                  onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                  startInLoadingState={true}
                  scalesPageToFit={this.state.scalesPageToFit}
                />

            </View>
            

        )
    }
}


