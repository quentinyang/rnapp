'use strict';

import {React, Component, View, Text, StyleSheet} from 'nuke';

export default class TitleBar extends Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<View style={[styles.row, styles.center, styles.titleBox]}>
                <Text style={styles.bar}></Text>
                <Text>{this.props.title}</Text>
            </View>
		);
	}
}

let styles = StyleSheet.create({
	row: {
        flexDirection: 'row'
    },
    center: {
        alignItems: 'center',
    },
    titleBox: {
    	paddingLeft: 15,
        height: 42
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
    }
});