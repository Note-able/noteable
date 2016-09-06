import { combineReducers } from 'redux';

import * as editorReducers from './editor-reducer.js';
import * as profileReducers from './profile-reducer.js';
import * as messageReducers from './message-reducer.js';

export const editorReducer = combineReducers({
	...editorReducers,
});

export const appReducer = combineReducers({
	...profileReducers,
	...editorReducers,
	...messageReducers,
});