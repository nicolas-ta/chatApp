import {loginReducer} from '../src/reducers/login';

describe('Login Reducer unit tests', () => {
  describe('edit nickname action', () => {
    it('should return state with undefined nickname from empty action payload when action is edit-nickname', () => {
      // GIVEN
      const state = {};
      const mockPayload = {};
      const action = {type: 'edit-nickname', payload: mockPayload};
      const expectedResult = {...state, nickname: undefined};

      // WHEN
      const result = loginReducer.call(null, state, action);

      // THEN
      expect(result).toEqual(expectedResult);
    });
  });
});
