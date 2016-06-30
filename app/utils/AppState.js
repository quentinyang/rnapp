'use strict';

import { AppState } from 'nuke';

let handler;

module.exports = {
	addEventListener: (activeListener, backgroundListener, inactiveListener) => {
		handler = (currentAppState) => {
			if(currentAppState == 'active') {
				console.log('active');
				activeListener && activeListener();
			}
			if(currentAppState == 'background') {
				console.log('background');
				backgroundListener && backgroundListener();
			}
			if(currentAppState == 'inactive') {
				console.log('inactive');
				inactiveListener && inactiveListener();
			}
		};

		AppState.addEventListener('change', handler);
	},

	removeEventListener: () => {
		AppState.removeEventListener('change', handler);
	}
};