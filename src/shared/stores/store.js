import messageApp from '../reducers/message-reducer';
import editor from '../reducers/editor-reducer';
import { combineReducers } from 'redux';

export const editorStore = combineReducers({ messageApp: messageApp, editor: editor });
export const appStore = combineReducers({ });