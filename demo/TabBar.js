'use strict';

import {
    React,
    Component,
    StyleSheet,
    TabBar,
    Text,
    View
} from 'nuke';

export default class TabBarDemo extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedTab: '历史',
            notifCount: 0,
            presses: 0
        };
    }

    _renderContent(color: string, pageText: string, num?: number) {
        return (
            <View style={[styles.tabContent, {backgroundColor: color}]}>
                <Text style={styles.tabText}>{pageText}</Text>
                <Text style={styles.tabText}>第 {num} 次重复渲染{pageText}</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Text style={styles.welcome}>
                    TabBar使用实例
                </Text>
                <TabBar
                    style={{flex:1, alignItems:"flex-end"}}
                    tintColor="white"
                    translucent={true}
                    barTintColor="darkslateblue">
                        <TabBar.Item
                            title="自定义"
                            selected={this.state.selectedTab === '自定义'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '自定义',
                                });
                            }}
                            systemIcon='bookmarks'
                        >
                            {this._renderContent('#414A8C', '自定义界面')}
                        </TabBar.Item>
                        <TabBar.Item
                            systemIcon="history"
                            selected={this.state.selectedTab === '历史'}
                            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '历史',
                                    notifCount: this.state.notifCount + 1,
                                });
                            }}
                        >
                            {this._renderContent('#783E33', '历史记录', this.state.notifCount)}
                        </TabBar.Item>
                        <TabBar.Item
                            systemIcon="downloads"
                            selected={this.state.selectedTab === '下载'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: '下载',
                                    presses: this.state.presses + 1
                                });
                            }}
                        >
                            {this._renderContent('#21551C', '下载页面', this.state.presses)}
                        </TabBar.Item>
                </TabBar>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
});