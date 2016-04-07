'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, ListView, Image, PixelRatio,
            TouchableWithoutFeedback, RefreshControl, InteractionManager, ActivityIndicator,
            StatusBar, WebView, Alert} from 'nuke';

import TouchWebContainer from "../containers/TouchWebContainer";

import ContactHouseContainer from '../containers/ContactHouseContainer'
import InputHouseContainer from '../containers/InputHouseContainer'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

class Profile extends Component{
  render() {
    var portrait = this.props.portrait ? require(this.props.portrait) :  require('../images/profile.jpg');
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
    return number.slice(0, 3) + '****' + number.slice(-3);
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
        
        this.state = {
            url: 'https://api.fangyuan360.cn/usercenter/account/?token=' + gtoken 
        };
    }

    componentDidMount() {
      let {actions} = this.props;

      InteractionManager.runAfterInteractions(() => {
        actions.fetchUserProfile({});
      });


    }

    render() {
        let {userProfile} = this.props;

        var profileData = userProfile.toJS();

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var featureSource = ds.cloneWithRows([{title: '联系过的房源', count: profileData.contacted, component: ContactHouseContainer, name: 'contactHouse'},
            {title: '发布的房源', count: profileData.published, component: InputHouseContainer, name: 'inputHouse'}]);
        var settingSource = ds.cloneWithRows([{title: '设置', component: '', name: 'settings'}]);

        return (
            <View style={styles.layout}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>我的</Text>
                </View>
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

                  {/* Ugly to set background */}
                  <View style={{height: 300}}></View>
  
            </View>
            

        )
    }

    _renderRow(data, section, rowId, d) {
      var separator = (rowId != 0) ? styles.listSeparator : {};
      return (
          <TouchableWithoutFeedback onPress={this._goPage.bind(this, data)}>
              <View style={[styles.listItem, separator]}>
                  <Text style={styles.listText}>{data.title}</Text>
                  <Text style={[styles.listText, styles.listBadge, styles.absoluteTop]}>{data.count || ''}</Text>
                  <Image source={require('../images/arrow-right.png')} style={[styles.listIcon, styles.absoluteTop]}/>
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
}


const styles = StyleSheet.create({
    layout: {
        backgroundColor: '#EEE',
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
    // header
    header: {
      alignItems: 'center',
      marginTop: 40/PixelRatio.get(),
    },
    headerText: {
      fontSize: 19,
      color: '#3E3E3E',
      margin: 12
    },
    // profile
    profileContainer: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      justifyContent: 'center',
      borderColor: '#ccc',
      height: 154,
      alignItems: 'center',
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#000',
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
      alignItems: 'center',
      height: 60,
    },
    cashImage: {
      width: 35,
      height: 35,
    },
    cashText: {
      fontSize: 16,
      color: '#3E3E3E',
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    listText: {
      fontSize: 16,
      color: '#3E3E3E',
      paddingLeft: 15,
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
      width: 14/PixelRatio.get(),
      height: 36/PixelRatio.get(),
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
    }
});