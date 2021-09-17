import {inviteReducer} from '@reducers/invite';

const mockUser1 = {userId: 'test1'};
const mockUser2 = {userId: 'test2'};

describe('Invite reducer unit tests', () => {
  test('checking initial state', () => {
    const action = {type: 'nonexistent'};
    expect(inviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking refresh state', () => {
    const action = {type: 'refresh'};
    expect(inviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking reset-selection state', () => {
    const action = {type: 'reset-selection'};
    expect(inviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking fetch-users empty state', () => {
    const action = {
      type: 'fetch-users',
    };
    const state = {
      channel: undefined,
      users: [mockUser1],
      userMap: {userId: 'test2'},
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking fetch-users state', () => {
    const action = {
      type: 'fetch-users',
      payload: {users: [{userId: 'test1'}, {userId: 'test2'}]},
    };
    const state = {
      channel: {members: [mockUser1]},
      users: [mockUser1],
      userMap: {userId: 'test2'},
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking select-user empty state', () => {
    const action = {type: 'select-user'};
    const state = {
      error: '',
      selectedUsers: [mockUser1, mockUser2],
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking select-user state', () => {
    const action = {type: 'select-user', payload: {user: mockUser1}};
    const state = {
      error: '',
      selectedUsers: [mockUser1, mockUser2],
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking select-user not included state', () => {
    const action = {type: 'select-user', payload: {user: {userId: 'test3'}}};
    const state = {
      error: '',
      selectedUsers: [mockUser1, mockUser2],
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking unselect-user empty state', () => {
    const action = {type: 'unselect-user'};
    const state = {
      error: '',
      selectedUsers: [mockUser1, {userId: 'test1'}],
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking unselect-user included state', () => {
    const action = {type: 'unselect-user', payload: {user: mockUser1}};
    const state = {
      error: '',
      selectedUsers: [mockUser1, {userId: 'test1'}],
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking unselect-user not included state', () => {
    const action = {type: 'unselect-user', payload: {user: mockUser1}};
    const state = {
      error: '',
      selectedUsers: [mockUser2, {userId: 'test3'}],
    };
    expect(inviteReducer(state, action)).toMatchSnapshot();
  });

  test('checking start-loading state', () => {
    const action = {type: 'start-loading'};
    expect(inviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking end-loading state', () => {
    const action = {type: 'end-loading'};
    expect(inviteReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking error state', () => {
    const action = {type: 'error'};
    expect(inviteReducer(undefined, action)).toMatchSnapshot();
  });
});
