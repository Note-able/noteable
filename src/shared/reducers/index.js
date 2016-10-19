import { combineReducers } from 'redux';

import * as currentUserReducers from './current-user-reducer.js';
import * as editorReducers from './editor-reducer.js';
import * as profileReducers from './profile-reducer.js';
import * as messageReducers from './message-reducer.js';
import * as validatorReducers from './validator-reducer.js';

export const editorReducer = combineReducers({
  ...editorReducers,
});

export const appReducer = combineReducers({
  ...profileReducers,
  ...editorReducers,
  ...messageReducers,
  ...currentUserReducers,
  ...validatorReducers,
});
