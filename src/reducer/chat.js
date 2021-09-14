export const chatReducer = (state, action) => {
  switch (action.type) {
    case 'refresh': {
      return {
        ...state,
        selectedChannel: undefined,
        messageMap: {},
        messages: [],
        loading: false,
        error: null,
      };
    }

    case 'switch-channel': {
      return {
        ...state,
        selectedChannel: action.payload,
      };
    }
    case 'fetch-messages': {
      const {messages} = action.payload || {};
      const distinctMessages = messages.filter(
        message => !state.messageMap[message.reqId],
      );
      const mergedMessages = [...state.messages, ...distinctMessages];
      for (let i = 0; i < mergedMessages.length - 1; i++) {
        mergedMessages[i].hasSameSenderAbove =
          mergedMessages[i].sender &&
          mergedMessages[i + 1].sender &&
          mergedMessages[i].sender.userId ===
            mergedMessages[i + 1].sender.userId;
      }

      const messageMap = {};
      for (let i in distinctMessages) {
        const message = distinctMessages[i];
        messageMap[message.reqId] = true;
      }
      return {
        ...state,
        messages: mergedMessages,
        messageMap,
        empty: mergedMessages.length === 0 ? 'Start conversation.' : '',
      };
    }
    case 'receive-message':
      const {message, clearInput} = action.payload || {};

      if (state.messages.length > 0) {
        message.hasSameSenderAbove =
          message.sender &&
          state.messages[0].sender &&
          message.sender.userId === state.messages[0].sender.userId;
      }

      return {
        ...state,
        messages: [message, ...state.messages],
        messageMap: {...state.messageMap, [message.reqId]: true},
        input: clearInput ? '' : state.input,
        empty: '',
      };
    case 'send-message': {
      const {message, clearInput} = action.payload || {};

      if (!state.messageMap[message.reqId]) {
        if (state.messages.length > 0) {
          message.hasSameSenderAbove =
            message.sender &&
            state.messages[0].sender &&
            message.sender.userId === state.messages[0].sender.userId;
        }

        return {
          ...state,
          messages: [message, ...state.messages],
          messageMap: {...state.messageMap, [message.reqId]: true},
          input: clearInput ? '' : state.input,
          empty: '',
        };
      } else {
        for (let i in state.messages) {
          if (state.messages[i].reqId === message.reqId) {
            const updatedMessages = [...state.messages];
            message.hasSameSenderAbove = updatedMessages[i].hasSameSenderAbove;
            updatedMessages[i] = message;

            return {
              ...state,
              input: clearInput ? '' : state.input,
              messages: updatedMessages,
            };
          }
        }
      }
      break;
    }

    case 'typing': {
      const {input} = action.payload || {};
      return {...state, input};
    }
    case 'start-loading': {
      return {...state, loading: true, error: ''};
    }
    case 'end-loading': {
      const {error} = action.payload || {};
      return {...state, loading: false, error};
    }
    case 'error': {
      const {error} = action.payload || {};
      return {...state, error};
    }
  }
  return state;
};
