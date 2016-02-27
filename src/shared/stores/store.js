const messages = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      if (action.content) {
        return [
          ...state, 
          {
            content: action.content,
            userId: state.userId,
            documentId: state.documentId,
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
    default:
      return {
        userId: -1,
        documentId: -1,
        messages: [],
      }
  }
}

module.exports = editorApp;
