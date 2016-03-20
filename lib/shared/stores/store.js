import messageApp from '../reducers/message-reducer';
import editor from '../reducers/editor-reducer';
import { combineReducers } from 'redux';

const store = combineReducers({ messageApp: messageApp, editor: editor });

module.exports = store;