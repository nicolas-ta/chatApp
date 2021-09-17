import {loginReducer} from '@reducers/login';

describe('Login Reducer unit tests', () => {
  test('checking initial state', () => {
    const action = {type: 'nonexistent'};
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking edit-userId state', () => {
    const action = {type: 'edit-userId'};
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking edit-nickname state', () => {
    const action = {type: 'edit-nickname'};
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking start-connection state', () => {
    const action = {type: 'start-connection'};
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking end-connection state', () => {
    const action = {type: 'end-connection'};
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking error empty state', () => {
    const action = {type: 'error'};
    expect(loginReducer(undefined, action)).toMatchSnapshot();
  });
});
