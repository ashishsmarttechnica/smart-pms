const initialState = {
  teamManager: [],
  loading: false,
  error: null
}

const TeamManagerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TEAM_MANAGER_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      }

    case 'GET_TEAM_MANAGER':
      return {
        ...state,
        teamManager: action.payload,
        loading: false,
        error: null
      }

    case 'TEAM_MANAGER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    default:
      return state
  }
}

export default TeamManagerReducer
