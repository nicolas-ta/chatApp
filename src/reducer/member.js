export const memberReducer = (state, action) => {
  switch (action.type) {
    case 'refresh': {
      const {members} = action.payload || {};
      return {...state, members, error: ''};
    }
    case 'add-member': {
      const {user} = action.payload || {};
      if (!state.members.map(m => m.userId).includes(user.userId)) {
        return {...state, members: [...state.members, user], error: ''};
      }
      break;
    }
    case 'remove-member': {
      const {user} = action.payload || {};
      if (state.members.map(m => m.userId).includes(user.userId)) {
        return {
          ...state,
          members: state.members.filter(m => m.userId !== user.userId),
          error: '',
        };
      }
      break;
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
