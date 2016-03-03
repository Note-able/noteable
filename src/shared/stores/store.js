const AJAX = require('../ajax');

const messages = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_MESSAGE':
      const messageExists = state.messages ? state.messages.filter(message => {
        return (message.id === action.id);
      }) : [];
      if (action.content && messageExists.length === 0) {
        return [
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
        const json = JSON.parse(action.response);
        json.map(message => {
           myState = messages(myState, {type: 'ADD_MESSAGE', content: message.content, userId: message.user_id, documentId: message.document_id, id: message.id} );
        });
        return myState;
      };
    default: 
      return [];
  }
}

const editorApp = (state = {}, action) => {
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
    case 'ADD_DETAILS':
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

module.exports = editorApp;
