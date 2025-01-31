const initialState = {
  teamMembers: [],
  loading: false,
  error: null
}

const TeamUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TEAM_MEMBERS_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      }

    case 'GET_TEAM_MEMBERS':
      return {
        ...state,
        teamMembers: action.payload,
        loading: false,
        error: null
      }

    case 'TEAM_MEMBERS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    default:
      return state
  }
}

export default TeamUserReducer
