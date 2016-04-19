const events = (state = [], action) => {
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
  default: 
    return [];
  }
}

const eventsApp = (state = {}, action) => {
  switch (action.type) {
    default:
      return {
        markers: [],
      }
  }
}

module.exports = eventsApp;
