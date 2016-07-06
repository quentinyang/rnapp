'use strict';

import { AppState } from 'nuke';

let handler;

module.exports = {
	addEventListener: (activeListener, backgroundListener, inactiveListener) => {
		handler = (currentAppState) => {
			if(currentAppState == 'active') {
				activeListener && activeListener();
			}
			if(currentAppState == 'background') {
				backgroundListener && backgroundListener();
			}
			if(currentAppState == 'inactive') {
				inactiveListener && inactiveListener();
			}
		};

		AppState.addEventListener('change', handler);
	},

	removeEventListener: () => {
		AppState.removeEventListener('change', handler);
	}
};