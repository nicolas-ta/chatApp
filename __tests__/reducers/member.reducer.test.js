import {memberReducer} from '@reducers/member';

describe('Member Reducer unit tests', () => {
  test('checking initial state', () => {
    const action = {type: 'nonexistent'};
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking refresh state', () => {
    const action = {type: 'refresh'};
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking add-member new state', () => {
    const action = {
      type: 'add-member',
      payload: {
        user: {
          userId: 'third_member',
        },
      },
    };

    const state = {
      members: [
        {
          userId: 'first_member',
        },
        {
          userId: 'second_member',
        },
      ],
    };

    expect(memberReducer(state, action)).toMatchSnapshot();
  });

  test('checking add-member existing state', () => {
    const action = {
      type: 'add-member',
      payload: {
        user: {
          userId: 'first_member',
        },
      },
    };

    const state = {
      members: [
        {
          userId: 'first_member',
        },
        {
          userId: 'second_member',
        },
      ],
    };

    expect(memberReducer(state, action)).toMatchSnapshot();
  });

  test('checking add-member missing argument state', () => {
    const action = {
      type: 'add-member',
      payload: {
        user: {
          userId: 'first_member',
        },
      },
    };

    const state = {
      members: [],
    };

    expect(memberReducer(state, action)).toMatchSnapshot();
  });

  test('checking add-member empty argument state', () => {
    const action = {
      type: 'add-member',
    };

    const state = {
      members: [],
    };

    expect(memberReducer(state, action)).toMatchSnapshot();
  });

  test('checking start-loading state', () => {
    const action = {type: 'start-loading'};
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking end-loading state', () => {
    const action = {type: 'end-loading'};
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });

  test('checking error state', () => {
    const action = {type: 'error'};
    expect(memberReducer(undefined, action)).toMatchSnapshot();
  });
});
