import React from 'react-native';
const {
  StyleSheet,
  Image,
  Text,
  Linking,
  TextInput,
  TouchableHighlight,
  View
} = React;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        phone: '',
        code: ''
    };
  }

  onPress(url) {
    Linking.openURL(url);
  }

  render() {
    return (
        <View style={styles.container}>
            <View>
                <View style={{alignItems: 'center'}}>
                    <Image
                        style={{width: 110, height: 110}}
                        source={require('../images/flower.jpg')}
                    />
                    <Text style={styles.fytitle}>
                        房源360
                    </Text>
                    <Text style={styles.fysubtitle}>
                        房源信息共享平台
                    </Text>
                </View>
                <View style={styles.phoneBox}>
                    <TextInput
                        style={styles.fiPhone}
                        onChangeText={(phone) => this.setState({phone})}
                        keyboardType='numeric'
                        placeholder='手机号'
                        placeholderTextColor=''
                        maxLength={11}
                        underlineColorAndroid='transparent'
                        value={this.state.phone}
                    />
                    <TouchableHighlight
                        style={styles.codeButton}
                    >
                        <Text style={styles.codeText}>
                            发送验证码
                        </Text>
                    </TouchableHighlight>
                </View>
                <TextInput
                    style={styles.fiCode}
                    onChangeText={(code) => this.setState({code})}
                    keyboardType='numeric'
                    placeholder='验证码'
                    maxLength={4}
                    value={this.state.code}
                />
                <TouchableHighlight
                    style={styles.submitButton}
                >
                    <Text style={styles.submitText}>
                        登录
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    );
  }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 25,
        marginRight: 25
    },
    fytitle: {
        marginTop: 10,
        fontSize: 40,
        textAlign: 'center',
        color: '#04c1ae'
    },
    fysubtitle: {
        marginTop: 10,
        marginBottom: 80,
        fontSize: 14,
        textAlign: 'center',
        color: '#3e3e3e'
    },
    phoneBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 1
    },
    fiPhone: {
        flex: 1,
        paddingLeft: 10,
        height: 45,
        fontSize: 16,
        color: '#3e3e3e',
        borderWidth: 0
    },
    codeButton: {
        width: 100,
        height: 20,
        borderLeftWidth: 1,
        borderColor: '#ccc'
    },
    codeText: {
        marginVertical: 2,
        fontSize: 15,
        color: '#8d8c92',
        textAlign: 'center'
    },
    fiCode: {
        marginBottom: 25,
        paddingLeft: 10,
        height: 45,
        fontSize: 16,
        color: '#3e3e3e',
        borderColor: '#d9d9d9',
        borderWidth: 1,
        borderRadius: 1
    },
    submitButton: {
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5
    },
    submitText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    }
})

export default Login;