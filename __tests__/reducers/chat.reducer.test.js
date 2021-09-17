import {chatReducer} from '@reducers/chat';

const mockMessage1 = {
  sender: {userId: 'userId1'},
  reqId: 'reqId1',
  hasSameSenderAbove: true,
};

const mockMessage2 = {
  sender: {userId: 'userId2'},
  reqId: 'reqId2',
  hasSameSenderAbove: false,
};

describe('Member Reducer unit tests', () => {
  test('checking initial state', () => {
    const action = {type: 'nonexistent'};
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking refresh state', () => {
    const action = {type: 'refresh'};
    const state = {...state};
    expect(chatReducer(state, action)).toMatchSnapshot();
  });

  test('checking fetch-messages empty state', () => {
    const action = {type: 'fetch-messages'};

    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking fetch-messages state', () => {
    const action = {type: 'fetch-messages', payload: {messages: []}};
    const state = {messageMap: [], messages: []};
    expect(chatReducer(state, action)).toMatchSnapshot();
  });

  test('checking receive-message empty state', () => {
    const action = {type: 'receive-message'};
    const state = {messages: []};
    expect(chatReducer(state, action)).toMatchSnapshot();
  });

  test('checking receive-message state', () => {
    const action = {type: 'receive-message', payload: {message: mockMessage1}};
    const state = {messages: []};
    expect(chatReducer(state, action)).toMatchSnapshot();
  });

  test('checking send-message empty state', () => {
    const action = {
      type: 'send-message',
    };
    const state = {messageMap: [], messages: []};
    expect(chatReducer(state, action)).toMatchSnapshot();
  });

  test('checking send-message state', () => {
    const action = {
      type: 'send-message',
      payload: {
        sentMsg: mockMessage1,
        sentClearInput: true,
      },
    };
    const state = {messageMap: {}, messages: []};
    expect(chatReducer(state, action)).toMatchSnapshot();
  });

  test('checking typing state', () => {
    const action = {type: 'typing'};
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking start-loading state', () => {
    const action = {type: 'start-loading'};
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking end-loading state', () => {
    const action = {type: 'end-loading'};
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking error state', () => {
    const action = {type: 'error'};
    expect(chatReducer(undefined, action)).toMatchSnapshot();
  });
});
