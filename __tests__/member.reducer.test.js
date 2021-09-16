import {memberReducer} from '../src/reducer/member';

describe('Member Reducer unit tests', () => {
  describe('refresh action - in order to full coverage refresh action with all possible use cases', () => {
    it('should return state with members from action payload and empty string error when action is of type refresh', () => {
      // GIVEN
      const state = {};
      const member1 = {
        name: 'first_member',
      };
      const member2 = {
        name: 'second_member',
      };
      const mockMembers = [member1, member2];
      const action = {
        type: 'refresh',
        payload: {
          members: mockMembers,
        },
      };
      const emptyStringError = '';
      const expectedResult = {
        ...state,
        members: mockMembers,
        error: emptyStringError,
      };

      // WHEN
      const result = memberReducer.call(null, state, action);

      // THEN
      expect(result).toEqual(expectedResult);
    });

    it('should return state with undefined members from empty action payload and empty string error when action is of type refresh', () => {
      // GIVEN
      const state = {};
      const action = {
        type: 'refresh',
        payload: {},
      };
      const emptyStringError = '';
      const expectedResult = {
        ...state,
        members: undefined,
        error: emptyStringError,
      };

      // WHEN
      const result = memberReducer.call(null, state, action);

      // THEN
      expect(result).toEqual(expectedResult);
    });
  });
});
