const AJAX = require('../ajax');
import { combineReducers } from 'redux';

const messages = (state = [], action) => {
  switch (action.type) {
  case 'RECEIVE_MESSAGE':
    const messages = state.messages.filter(message => {
      return (message.id === action.id);
    });
    const messageExists = state.messages ? messages : [];

    if (action.content && messageExists.length === 0) {
      return [
        /*eslint-disable */
        ...state,
        {
          content: action.content,
          userId: action.userId,
          documentId: action.documentId,
          destinationId: action.destinationId,
          id: action.id
        }
      ]
    }
  case 'ADD_MESSAGE':
    if (action.content) {
      return [
        ...state, 
        {
          content: action.content,
          userId: action.userId,
          documentId: action.documentId ? action.documentId : null,
          destinationId: action.destinationid ? action.destinationId : null,
          id: action.id
        }
      ];
    }
    
    return state;
  case 'PAGE_MESSAGES':
    let myState = state;
    if (action.response) {
      action.response.map(message => {
          myState = messages(myState, {type: 'ADD_MESSAGE', content: message.content, userId: message.user_id, documentId: message.document_id, id: message.id} );
      });
      return myState;
    };
  default: 
    return [];
  }
}

const editorLine = (state = {}, action) => {
  console.log('EDITOR LINE REDUCER');
  switch (action.type){
  case 'UPDATE_TEXT':
    /*eslint-disable*/
    if(state.lineId != action.lineId)
      return state;
      
    return Object.assign({},
    state,
    {
      text: action.text,
      updateTextFunction: action.updateTextFunction
    });
  case 'ADD_LINE':
    return Object.assign({},
    state,
    {
      lineId: action.lineId,
      text: action.text,
      type: action.lineType
    });
  }
}

const editorSection = ( state = {}, action) => {
  console.log('EDITOR SECTION REDUCER');
  switch (action.type){
  case 'ADD_SECTION':
      return {
       lineData: [],
       selectedIndex: 0
     };
  case 'UPDATE_LINES':
    if(state.sectionId != action.sectionId)
      return state;
    else {
      let lineData = state.lineData;
      for(const lineAction in action.lineActions) {
        lineData = editorSection(state, action.lineActions[lineAction]).lineData;
      }
      
      return Object.assign({},
      state,
      {
        lineData: lineData,
        selectedLine: lineData[action.selectedIndex],
        selectedIndex: action.selectedIndex,
        offset: action.offset
      });
    }
  case 'UPDATE_SELECTED':
    if(state.sectionId != action.sectionId)
      return state;
    else {
      return Object.assign({},
      state,
      {
        selectedIndex: action.index,
        selectedLine: state.lineData[action.index],
        offset: action.offset
      });
    }
     /* Line Reducer */
  case 'UPDATE_TEXT':
    if(state.sectionId != action.sectionId)
      return state;
    /*eslint-disable*/
    return Object.assign({},
    state,
    {
      lineData: state.lineData.map(line => editorLine(line, action))
    });
  case 'ADD_LINE':
    if(state.sectionId != action.sectionId)
      return state;
    else {
      const lineData = state.lineData;
      lineData.splice(action.index, 0, editorLine(undefined, action))
      if(action.shouldUpdateIndex)
      {
        return Object.assign({},
        state,
        {
          lineData: lineData,
          selectedIndex: action.index,
          selectedLine: lineData[action.index]
        });
      } else {
        return Object.assign({},
        state,
        {
          lineData: lineData
        });
      }
    }
  case 'DELETE_LINE':
    if(state.sectionId != action.sectionId)
      return state;
    else {
      const lineData = state.lineData;
      lineData.splice(action.index, 1)
      return Object.assign({},
      state,
      {
        lineData: lineData,
        selectedIndex: action.index - 1,
        selectedLine: lineData[action.index - 1]
      });
    }
  default:
    return state;
  }
}

const editor = (state = {}, action) => {
  console.log('STORRRRRRE');
  switch (action.type) {
    case 'DEFAULT_EDITOR':
      return {
        sectionData: action.sectionData
      };
    /* Section Reducer */
    case 'UPDATE_LINES':
      return Object.assign({},
      state,
      {
        sectionData: state.sectionData.map(section => editorSection(section, action))
      });
    /*eslint-disable*/
    case 'ADD_SECTION':
      return Object.assign({},
      state,
      {
        sectionData: [...state.sectionData, editorSection(undefined, action)]
      });
    /* Line Reducer */
    case 'UPDATE_TEXT':
    return Object.assign({},
    state,
    {
      sectionData: state.sectionData.map(section => editorSection(section, action))
    });
    case 'ADD_LINE':
    case 'DELETE_LINE':
    case 'UPDATE_SELECTED':
    return Object.assign({},
    state,
    {
      sectionData: state.sectionData.map(section => editorSection(section, action))
    });
   default:
    return state;
  }
}

const messageApp = (state = {}, action) => {
  console.log('STORRRRRRE');
  switch (action.type) {
    case 'ADD_MESSAGE':
      return Object.assign({},
        state,
        {
          messages: messages(state.messages, action)
        });
    case 'RECEIVE_MESSAGE':
      return Object.assign({},
        state,
        {
          messages: messages(state.messages, action)
        });
    case 'PAGE_MESSAGES':
      return Object.assign({},
        state,
        {
          messages: messages(state.messages, action)
        });
    case 'INITIAL_STATE':
      return Object.assign({},
        state,
        {
          userId: action.userId,
          documentId: action.documentId
        });
    default:
      return {
        userId: -1,
        documentId: -1,
        messages: [],
      }
  }
}

const editorApp = combineReducers({ messageApp: messageApp, editor: editor });
/*eslint-enable */
module.exports = editorApp;