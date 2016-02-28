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
            contextId: action.contextId,
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
            userId: state.userId,
            contextId: state.documentId,
            id: action.id
          }
        ];
      }
      
      return state;
    case 'GET_MESSAGES':
      if (action.documentId) {
        //fetch mesages based on document id and optional offset.
        return [
          ...state,
          //..response.messages.map( #map to message objects.)
        ];
      }
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
    default:
      return {
        userId: -1,
        documentId: -1,
        messages: [],
      }
  }
}

module.exports = editorApp;
