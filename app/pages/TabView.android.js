'use strict';

import {React, Component, View, Text, StyleSheet, Navigator, TouchableOpacity, Image} from 'nuke';
import HomeContainer from '../containers/HomeContainer';
import HouseInputContainer from '../containers/HouseInputContainer';
import UserContainer from '../containers/UserContainer';

let _navigator = null;

export default class TabView extends Component {
    constructor(props) {
        super(props);

        this._renderScene = this._renderScene.bind(this);
        this._onWillFocus = this._onWillFocus.bind(this);
        this.state = {
            tabIndex: 0
        };
    }

    _renderScene(route, nav) {
        _navigator = nav;
        let {navigator} = this.props;

        switch(route.key) {
            case 0:
                return <HomeContainer navigator={navigator} rout='全部房源'/>;
                break;
            case 1:
                return <HouseInputContainer navigator={navigator} rout='发房'/>;
                break;
            case 2:
                return <UserContainer navigator={navigator} rout='我的'/>;
                break;
        }
    }

    _onWillFocus(route) {
        this.setState({
            tabIndex: route.key
        });
    }

    render() {
        return (
            <Navigator
                style={styles.container}
                initialRoute={tabArr[0]}
                renderScene={this._renderScene}
                sceneStyle={styles.sceneStyle}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    } else {
                        return Navigator.SceneConfigs.FadeAndroid;
                    }
                }}
                navigationBar={
                    <TabBar
                        navigator={_navigator}
                        tabIndex={this.state.tabIndex}
                        actionsUser={this.props.actionsUser}
                    />
                }
                onWillFocus={this._onWillFocus}
            />
        );
    }
}

class TabBar extends Component {
    constructor(props) {
        super(props);

        this.changeNavigatorItem = this.changeNavigatorItem.bind(this);
    }

    render() {
        let {tabIndex, navigator, actionsUser} = this.props;

        return (
            <View style={styles.tabbar}>
            {
                tabArr.map(
                    (tabItem) => {
                        let isCurrentTab = tabIndex === tabItem.key;
                        let tabTextStyle = isCurrentTab ? styles.tabTextSelected : null;
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.tabitem}
                                key={tabItem.key}
                                onPress={()=>{
                                    if(tabIndex !== tabItem.key) {
                                        this.changeNavigatorItem(tabItem.key);
                                    }
                                    if (tabItem.key == 2) {
                                        actionsUser.fetchUserProfile({});
                                    }
                                }}
                            >
                                <View style={[styles.container, styles.center]}>
                                    <Image
                                        source={{uri: tabIndex == tabItem.key ? tabItem.selectedIcon : tabItem.icon}}
                                        style={{width: tabItem.width, height: tabItem.height,  marginBottom: 3}}
                                    />
                                    <Text style={[styles.tabText, tabTextStyle]}>{tabItem.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                )
            }
            </View>
        );
    }

    changeNavigatorItem(key) {
        let {tabIndex, navigator} = this.props;
        let cRoutes = navigator.getCurrentRoutes();
        if (cRoutes.length == 3) {
            navigator.jumpTo(tabArr[key])
        } else {
            let hasKeyRoute = cRoutes.filter((route) => {
                return route.key == key
            });

            if (hasKeyRoute.length > 0) {
                navigator.jumpTo(tabArr[key])
            } else {
                navigator.push(tabArr[key])
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sceneStyle: {
        backgroundColor: '#fff'
    },
    tabbar: {
        backgroundColor: '#fff',
        borderTopColor:'#ddd',
        borderTopWidth: 1,
        height: 50,
        flexDirection:'row',
        position: 'relative',
        bottom:0,
        left:0,
        right:0,
    },
    tabitem: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
    },
    tabText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: -2
    },
    tabTextSelected: {
        color: '#04c1ae'
    },
    center: {
        alignItems: 'center',
        justifyContent:'center',
    },
    tabItemImage: {

    }
});

const tabArr = [
    {
        key: 0,
        title: '看房',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAnCAYAAAC42pApAAAAAXNSR0IArs4c6QAACdhJREFUaAXNWg1sFMcVnpn1nW04y4ZiqAqmTUlpE6sJpk1KK7UJVUIKUZoGXCemYMsNkuOfO/vuHNQkrZFI1CSK786+HzsuGCeAIBhKkyqiolVkqFoppYAFJa1KfusQWiCOIRiwfbc7/ebqPc2d7/Z2jYO6lj2zb755897MmzfvzZqSG/R0d3cXjoyotxCiljBOCznTCjE045xcJIReVDi9qDH6vttd/y6llN8IsehnNUgw2L0oGh27hxJ6LxT8NiH8C2bGopRchObHGCFHNaIc9HjqD2MyNDN9rWKmVfnutu45I3RsLRSu5pwvtSpMOjwm498wkL2csN1eb/2b6TBTpU2L8n5/5GbCtY1QuBqC2KcqTLZ+sIAjjNCnm72Nr2fDmmm/LuWDwS0LYtHRZzFQJRRXjAaE4FG0nyac/JNT/gnl7BLeNUJ5EeF8Fvb9HNRvwxaZbcQn3kbJAPzGZneL89WsWAPAlJTv7e3NGx6+3EI4fQJKz0jHH8qq2Od/hLkeZIz8YcmS0pPLly+PpcPKtECg88tUU+9QCV8B4VZjMork9qQ6peCd85jbXfdBEt3ki2XlA4HILVzT9kDpr2cY411C2Ra7ne9wOp1nM2BMkYPBA7mx2HurYBnrMd6D6AQ/OOm5wihrnV8yt6OiogITbv6xpLzfH6qB2YYzrPYpSPbL+Qs/32dVCDPiBoMv3hqNRlsxET8GftIkCH9gz6UVjY2N/zLDT2BMKR+JRBxjo1oXlF6Xyhje+AL275PN3oZtEOAzOZLkMScmwY9JuE+mizpOmSGF0oebvI1vpLale8+qfHt7522qqu7FYItTGWCwXqo4PG53DQIVa4/fv3W2zXatkPNFZ12uVWPWehPi8wWrIHwg1UHGfQ3lT3g8rhey8TRUPhAI3a2p/LdgUiAzwgAjCETqvF7nTpluVIfVUL8/XI4BK4FD4MMdAg9eqOIsp/w1xthWt7vxuBEfua29fcs8LTbayQlfLdPjdUp3Oxz26traWnHKpH0yKt/uC/1Q5WQPPHae3BPCnrAT7C1v42mZblQP+rrKoiTaA39RlgGnQZBnZpLcUG1L7ccZMBnJAV+oBYvxHGYx6biFrAdmzXasqampGU3XOa3yWKFqmHlPKjNsqi6b7Wa3FTMFr4fAayd4pT0ShVCMkhq31/VSOgHN0gKB4D1cIziFkuMEbM1DufnsgYaGhpFUXpOUx4o/rHK+C8CERxWmCbN8HPvIl8rA6L3DF/lOjKv9wGSO+ij5k9fr+q4RH7NtoVDopvExLqK/W+U+cMpvUlawMtU3JRQUYISpK+Cud6CaoENxFSv+qFXF/f6+fJWr2DYGiqMRgh1EMS0P4or3HST3Lsg7IDOENSzT1Mu/3759+0yZnlDS7w/eyTV1P8zTpgOgeBRrXu7xOHt1mulSO9eEfbjABN7ySWHEU/gMxgq+L1Y7BXfHxxcu7uvv78/R6XHlI75ICZyRMBd5ZhB306qpxs/wwBv0QYxKrEomJ2jUzbBNmHdunnIvJuCwDMRYPxg4dmqrTmMiTh8jGlacFOtEUVJGmjyexldkmtl6qC30NWAXmcHDIVUEAl1fyoRFVPlopjYjunBwc4qL7gfmrzIOi1INniIZI2x4aKQDpv5NGUAJewZ7PCzTrNRVSiYFRJn6Y2wH12J7001AIBBej5MiImL8TP2N6FVVVVdsdsf92L7vyDicCnV+f9f8HMLY61TjlZxo8UAG7v+M29vQ6mlplPGW6ohn5iI+MN0nPvla7G/+ttBeXGwdJxp1wGmt0lQtfgpwPrgQzN42zVACulw/vRDwRfZwoj6lk7EdhpBN5+dwrn0DgiYiOOGk2v3hnwP4tA62WmqUX7Kge5y9sABUapDh18QnTpo7xC6fWpVBxyPOeAQ6Pqm//6/k+cg6o6y4uPAFEP4uN2qcb8a+qJdpVuqKQget4I2xdLSpacMFY0z6VoTnK5F+v4yJTcQzWPVPMa8rRfbHxL5gSs4DIiNKYoHU1ecLrUuimXy5/fbSY3CZwybhhjBI/Qb2rOVsUUSWyEvETY8cYI1zovwIQdUJMWj8qMN18XtUIQ9ikKu6JPHZ4rxXmI1OM1uKGxvM8D6zeCMc1szyiRNoC1ZixfvAN6E4dONId6u83oZ+fbxEkON2O/+M8+0hNIzrjShz4G13IX10STRT1VzC4DNo2oTCFAOAIPBbJSXzdpvFC5w4GmEmIttMBDNCcfw81ux1iogz8ST2gk6Bqa8BUVxTKTpNlEg+nkfy8TOZlq0enzROOrLh0rXDcsY4ybnb7HV1X1+fcmbw/LM4tR6X+UFxlTJag1R5h0wX9UnKC2LcQ8JRoJowG0HHUrxKaT7i/A2fxN9N/MFkBmE9ThNQGRKDSSK6dJla9c7Ozlmj12KvIFBbITNBfRwyr8W9w69T6PHXtMqLFpEiairZj2pBHDnxBx3OUIWuxzY5JNON6ji/m5AVPg/hsgYrWPFzcEqV8t404o0L1SWaqgr/skjGgc81rPgayPk7mS7XMyovQIiwlsJxHIDQ8+ROqGuUsefKyko3mbmOFn3D4fAXkW7+ArzKcY6L73RJD4QdxImzzZ7HfOly7yQwXmDm9jOD/3kKKyuuzxPJWBxH6YfgtxoJ2dHUfvK7ofICKMJOrsZ2ISbG97bkB8L+heUwZ3NzQ1L8nIxKfsMHS9vVq+N3EpUvhIMt0gg/ryjK283N9SeTkZnfRAaKbwbboHRpKgpKH86fYauoq6s7n9qW+p5VedFBpIEDx97aBGciIqXECZFgRinu+Xirfn4m6NNcwWXqV2HirVBaHL+T5KCUBcuWlnrNWqMp5XUd2tvD31NVvhMOrESn6aU4ThA57cMl5Ca3u+EfOn06yokPJWLiM3wWo2cVSupwlGERzD+WlBds4571auxXUBR7d/IjJgFx/WGsy868PGV/fX39lCK9iZvZR3AercNKJ2Wd+qgTY22ZWWDfiFvaSzrdbGlZeZ2xzxdeRQlvg2D4h4P0jzhj0TKA/dmPyTiO/XhaUYrecTp/cjkuOBqF4/roo+HPadrYXJjtEiQh3wJ5GfwJPlomxxryKBD8JGE5LvH9XqZbqU9ZeTFI3BcMnNqA/Hgj9vxNZgeeUPwKlIMBJR+l2Xig7wnK+ObmZudv9AnM1idT+3UprzMV0dXZD8+Va5y4YfNi5ab7wb0+PQRhQ/g2/9r1Kq0LNy3K68xE2dHx4le0WHQt0uJyCFmKxZ3yGOh/FHt+l81G9lzvF19ZRr0+ZcF0BkZlMLitWFWv3cVVvgxx0WJgF8POF0CpGfqkoB6F8Q/BHwzBUX6AJOII4mj85h6xEkYbyfF/1SYUF19+e3p6kkLnGy3kfwEKldTe1Byb3AAAAABJRU5ErkJggg==',
        selectedIcon:'data:image/png;base64,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',
        width: 31.5,
        height: 19.5
    },
    {
        key: 1,
        title: '发房',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAuCAYAAABqK0pRAAAAAXNSR0IArs4c6QAABVhJREFUaAXtWX1oHEUUf2/ucpeaRktVGloCYsEPUIsilIKgYAXrHxUVIhirLcakSW4vt3eoFAP6R6RIcreXu0ubxJhWawUDKvSPSrEFwYKIgvgBaqVSCMbUqqRJ03z0dsY321672dvd+8htDCULl33z3pv33m9m3uybCYKHT19f3+q5OX6XdBEMsl/a29sveOWOeWFYCIGJnnTH7Iw+Jrj4Rv4kLXlS5oXPihtNp9Pr5+fhIAjxmG3AiJ8HArBTUZQxW3mZzIoC0bTU00LHQQHiZrd4EPAf9IlmVQ1/4qZXiqwiQIxcmOVJWjYvleQc8d1gNYtUIncWDSSZzGzWs/wwAdhYCgiT7mmfnzVGIqGvTbySybKBjIyM+P4YPdvJhegkr35Hz4ijhkyIekcdgCxD7NpQv66roaFBd9FzFJUFRNP23S50/QPKhS2OlqUA8SPGVu+WJOcX+mkDeFbSTg/lzlfo8z2vqm2/O+k48UsGosVTO7mAFBmsdTSKMImMhVQ1dMiso2mZHYLzjBBwo5lvoacYQliNhQ9a+K7NooEkEkNrQcwMUkI/U8DiScaqdqhq6xk7PU3bfxvnlw6BgIfs5DkeIn4MuKo5Gm36N8dzexcFhLbVrVzH9wDEehdjcp2/GYmG9lIQ3EWPVphgyURmjwB4g+gqZ10cYz7xIm3Tx511LktcgaRSR4PZ+dN7ASFCDp11EU8hQmM0qnxbyKFZnkikH6RldpiQ3WHmm2kaFEpFSPoDG/eEw0/MmWVm2jG43t799+jZ7IcE4F5zBytNCTpYUxtQW1paLlplxbQHBgZumJ6a1yjaZjd9AvSjz+9/rqOj9Sc7vTwgcuS1eCYMKN6m0QradZI8moFzDLApElOOOOmUwk/G09s5iCHyeatTP/I5BwJfU2OhlDFTJsUFQArWSVc60ix8xvzVuyKRl8+abC2aTCbfWcezswdodra5GrOp164CKaZOohGZoXx5NRoNZ1wdLVJIK6JdAO+m2VnlZMpar6H8Qo+OjtPHCpqcOhl8hO8Y8zWqavvPrnoVEmpa392c67QRwP2uJhGG6uvrdvu2bH64m7bVkIsyp4ToJuXGpqZdFV1KLj7h2LGjf5O/A5OT0zJPZQVxdfVY+j0wdf5iDcZ70n8SkDqL8HKT6iTG4AVVVb6wlS8RU9PSj3AO79M27VCv4TidEB1ByDrpvv8bhBwrGYOMRdZu9mMn6mhGUvSBtTwIJ2Kx8FYLd1k04/HUccqbR63B2J7ZUeAPVsXl0naKzfkcUSBy+nCy4eHhmunpoJGEa9ZwfWLilqyibLtUqNYqYLoscVlAtJ60koin3yKPVMpPG47P/SVfE6AlMiIRTx1Ro8pT1q+vUTUk0p/SBrRd0kZH+z9TyJC+V0q/vTifa7u08tUWcqiU6CCO7XlEBkgfsieTyX2bFvYCkDwpKwBCdqulPIhZ+7u1ywJCQ+lYg+WccY7VOTr3tuPlZHlvIfL65+mYGGUBMfVfNuSSAqmuFmcIebYo9Ai/FaV3RamsZC/FgVmX7q/Ge+OZx3UBVN0Kl0EUU4EgGzb3LUQvKRAZTEcsdIJe8lfRx2VUKurHc2MrQDwf4hIdrMxIiQPmufrKjHg+xCU6uN5nRGwocUCWUN0+NvujLsC8vDmh6L63ixBB9FM5vtZOluPRhXYn3WSfyrUr9N5EFxCvkK2A1Z5TiRKgDq9blXPt/EN+TnLtTf/J6rrW8p66fnLEuBj2fsA89oCzjG63v/TYi+fm6cR6kvmqqtrokmBJ7nO9QGTEzlircZNBlwGMLgbupDP1TV4488omY+J8JNL2q7x++g+SXOOFN4aENQAAAABJRU5ErkJggg==',
        selectedIcon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABVpJREFUaAXtWX1oW1UUP+d9NW1trR3FWRFFt6lUHcLQVZOiuMGqc206RLCbThxlfm0Tv5hMVrA6ZBPH6B+lTJ1uE/aHfWkdTnBD22TrxIH4UdRWZTJoJ6VbbW2XJnnvem5csyR99+VjSfpBHzxy7zm/e8753XPfu+fdAMxfM2sGMJvhlPV8fdXwhZHbuI+Sa4p/Hax48N9s+ZOyYZgxhqpX33JhaLifGcZ3/OZtLuO6bPjMuNECX3t5wDD2U7ArBQF/pcnyhnFnTb9An5Y4oxnRfG11AcP80YYED3Ilx3BsWhELBmUkI+Fn4fzwHmayZwR+LMUo4QclpSVbM/HsXDER1eu5Fxg7RGv/FstoEwgR8Q9ArA+6ar9NALVVp720HmNMVrz6DsqCz44EBXqW36Io+Fhug9viNkW4RPK0MuLwHrnZMIMHGbBKOwdE4HBhEWzimLFRaKGgH7fFA3bLkrrO71r9px3OSpcyEbVL38AA9tJyKrIyGJYhjiDCC0GX+0A0hl6/6xmDZhpbHC2PaSOOUlCbg1Xu/THyBJ2kiRSf/LJ0PHSxlYJYa2eTsuCTVVjvr3SfscI5uvWbjCAcoOw4rfQRGeJnBUp+w8h9q85HZDaNpIg4vJ4VIcY+JhLlYlsYAok1bne6dzYimmIcQCNjUpNP3wYMdtCtCrGI/QriU35X7TEh5pLClsiivi/y/hrw72SAW4mEEEtZ6AVJqg86a04nchitV33ty8A0+RtvSbQ8po1IjtmeG69zbPt98cMTMbqojjA47cSRO1go+Ck90HdG4ac0EbC1rFB5qX/Zo+NTlEkIyk9/XjA4Fnqf/DTYwcnPT6ioTwTuX/2zFW4KEZod1HyezcyEdwFYntWgsAxhUJbkjRPOmg4hJgVFnq99jWEa+2iplYmH4QRK8HrAWbuXVgG9cy5fMUSSqJMujcSjeXnS02PLa/6+bOrKW4Wn2q+dmDA/ogmsTmBtSr0WIcJrH9PAVjKyQGgE4SKl+DV6NTYLMRlQqJ2e5xmauyg7+WJzOCTJrCHgrGvjGOS7qcer02YFG8WDCAj4PWqsPlBZ94sdLlM6rbvtdhbAQ/Ts3G1nk/arfbUu9yZUO/XdBH5ZCEYwJcDdixcsebOnoiIgxGVBUdHTo/UN9b5lAnuFsiMsp2iS30Ols22AYlhoFQc9UGdlhCf9Lvc3VvpcyRxe/QGDwSf0IrpB4PMcZykiweuku6abBA+cx8BjoYk9LCCykGck5jUWBiIeD1W5VwgGTatY6dKP0eb8UHwQluuOdlL+lTcjL1FsSrrR8nqp+URHoamo4Ve4mi8bRQVGaN2i6mCiWitdn3bj0iJCpfyLTV7P25TiIjCM/+1TFTQ0DNA04GGU/g764nPH7768aqAvSp0GrLGr3eiLkUp5RvtVXYtd8NE6y6UVDRC0t4RJWCl5cclYjXbSszReHZaRzpYEH8QniKF4S4g3TP20iNDMimuwSSdMdkw2I79WsogytkF729TxsZCYXlpEYizMkE5OiWiafIaKnVCS3PuSxIVhaT3sqTiIxo7d88g5R5e+ymBYDciEk4ggjUqy+mGyjLmPnBLhDv1V7uP0w++MXsJZyaiXHBibJ5KDSU7JxXxGUpquHIDnM5KDSU7JxRzPCMPrU5qOXIIFsQk+dSEgMWkXSOYPVjGaDFroVKPUSheRSbCd0t0b6WeiYUpLTTRfJd9avDlrIvGoWdCfS88ICo/qZ0EiJkP00yEieCd7s/aX/iWTZE15jo4cc3Kem42J4rHLivRs+CinkY523jml38oM5epsOMuWTZRD/7yx3P3bdBw/ZYvT3LH7H6FU553G3LZSAAAAAElFTkSuQmCC',
        width: 25,
        height: 23
    },
    {
        key: 2,
        title: '我的',
        icon: 'data:image/png;base64,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',
        selectedIcon:'data:image/png;base64,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',
        width: 22.5,
        height: 22.5
    }
];