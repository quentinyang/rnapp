'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, ListView, Image, PixelRatio,
            TouchableWithoutFeedback, RefreshControl, InteractionManager, ActivityIndicator,
            WebView, Alert} from 'nuke';

import Header from '../components/Header';
import TouchWebContainer from "../containers/TouchWebContainer";
import ContactHouseContainer from '../containers/ContactHouseContainer'
import InputHouseContainer from '../containers/InputHouseContainer'
import LoginContainer from '../containers/LoginContainer'
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import * as common from '../constants/Common';

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

class Profile extends Component{
  render() {
    var portrait = this.props.portrait ? {uri: this.props.portrait} :  require('../images/profile.jpg');
    var mobileNum = this.props.mobile ? this._formatMobileNumber(this.props.mobile) : '130****1234';
    return (
        <View style={[styles.profileContainer]}>
          <Image style={[styles.profileImage]} source={portrait}/>
          <Text style={[styles.profileText]}>{mobileNum}</Text>
          <Text style={[styles.profileText]}>
            <Text>积分：</Text>
            <Text>{this.props.score || 0}</Text>
          </Text>
        </View>
    );
  }

  _formatMobileNumber(number) {
    return number.slice(0, 3) + '****' + number.slice(-4);
  }
}

class CashArea extends Component{
  render() {
    return (
      <View style={[styles.cashContainer]}>
        <TouchableWithoutFeedback onPress={this._triggerCharge}>
          <View style={[styles.row, styles.cashSplit]}>
            <Image source={require('../images/recharge.png')} style={[styles.cashImage]}/>
            <Text style={styles.cashText}>充值</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this._triggerWithdraw}>
          <View style={styles.row}>
            <Image source={require('../images/withdraw.png')} style={[styles.cashImage]} />
            <Text style={styles.cashText} >提现</Text>
          </View>
        </TouchableWithoutFeedback>


      </View>
    );
  }

  _triggerCharge = () => {
    Alert.alert('温馨提示', '充值功能正在赶过来，敬请期待！', [{text: '忍一忍'}]);
  };

  _triggerWithdraw = () => {
        let {navigator} = this.props;

        navigator.push({
            component: TouchWebContainer,
            name: 'withdrawal',
            title: '提现',
            hideNavBar: false,
            url: 'https://api.fangyuan360.cn/my/withdrawals/'
        });
  };

}


export default class User extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let {userProfile} = this.props;

        var profileData = userProfile.toJS();

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var featureSource = ds.cloneWithRows([{title: '联系过的房源', count: profileData.contacted, component: ContactHouseContainer, name: 'contactHouse'},
            {title: '发布的房源', count: profileData.published, component: InputHouseContainer, name: 'inputHouse'}]);
        var settingSource = ds.cloneWithRows([{title: '设置', component: '', name: 'settings'}]);

        return (
            <View style={styles.container}>
              <Header title='我的' style={styles.bgHeader} />
              <ScrollView automaticallyAdjustContentInsets={false}>

                  <View>
                    <Profile {...profileData}/>
                    <CashArea navigator={this.props.navigator}/>
                  </View>

                  <ListView
                    style={styles.listContainer}
                    dataSource={featureSource}
                    renderRow={this._renderRow.bind(this)}
                    scrollEnabled={false}
                    automaticallyAdjustContentInsets={false} />

                  <ListView
                    style={[styles.listContainer, styles.settingContainer]}
                    dataSource={settingSource}
                    renderRow={this._renderRow.bind(this)}
                    scrollEnabled={false}
                    automaticallyAdjustContentInsets={false} />

                  <TouchableWithoutFeedback onPress={this._loginOut.bind(this)}>
                      <View style={[styles.listItem, styles.listTop, styles.itemBg, styles.justifyContent]}>
                          <Text style={[styles.listText]}>退出</Text>
                      </View>
                  </TouchableWithoutFeedback>
              </ScrollView>
            </View>
        )
    }

    _renderRow(data, section, rowId, d) {
      var separator = (rowId != 0) ? styles.listSeparator : {};
      return (
          <TouchableWithoutFeedback onPress={this._goPage.bind(this, data)}>
              <View style={[styles.listItem, separator]}>
                  <Text style={[styles.listText, styles.flex]}>{data.title}</Text>
                  <Text style={[styles.listText, styles.listBadge]}>{data.count || ''}</Text>
                  <Image source={require('../images/next.png')} style={[styles.listIcon, styles.absoluteTop]}/>
              </View>
          </TouchableWithoutFeedback>
      );
    }
    _goPage(data) {
        let {navigator} = this.props;

        if(data.component) {
            navigator.push({
                component: data.component,
                name: data.name,
                title: data.title,
                hideNavBar: false
            });
        } else {
            Alert.alert('温馨提示', '设置功能正在赶过来，敬请期待！', [{text: '忍一忍'}]);
        }
    }

    _loginOut() {
        let {navigator} = this.props;
        AsyncStorageComponent.remove(common.USER_TOKEN_KEY);
        AsyncStorageComponent.get('user_phone')
        .then((value) => {
            navigator.resetTo({
              component: LoginContainer,
              name: 'login',
              title: '登录',
              phone: value,
              hideNavBar: true
            });
        })

    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee'
    },
    flex: {
       flex: 1
    },
    bgHeader: {
      backgroundColor: '#f8f8f8'
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      height: 35,
      flexWrap: 'nowrap',
    },
    // profile
    profileContainer: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      height: 154,
      alignItems: 'center',
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25
    },
    profileText: {
      fontSize: 16,
      lineHeight: 24,
      color: '#3E3E3E',
    },
    // cash area
    cashContainer: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1/PixelRatio.get(),
      borderColor: '#ccc',
      height: 60,
    },
    cashImage: {
      width: 35,
      height: 35,
    },
    cashText: {
      fontSize: 16,
      color: '#3E3E3E',
      marginLeft: 10,
    },
    cashSplit: {
      borderRightWidth: 1/PixelRatio.get(),
      borderColor: '#ccc',
    },
    // List
    listContainer: {
      top:0,
      paddingTop: 0,
      height: 90,
      backgroundColor: '#fff',
      marginTop: 16,
    },
    listItem: {
      height: 45,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    listText: {
      fontSize: 16,
      color: '#3E3E3E',
      marginLeft: 15,
    },
    absoluteTop: {
      position: 'absolute',
      top: 14,
    },
    listBadge: {
      color: '#8D8C92',
      right: 36,
    },
    listIcon: {
      width: 9,
      height: 18 ,
      right: 13,
    },
    listSeparator: {
      borderTopWidth: 1/PixelRatio.get(),
      borderColor: '#ccc',
    },
    // Setting
    settingContainer: {
      height: 45
    },

    webView: {
        height: 200,
    },

    listTop: {
        marginTop: 15
    },
    justifyContent: {
        justifyContent: 'center',
    },
    itemBg: {
        backgroundColor: '#fff'
    }
});