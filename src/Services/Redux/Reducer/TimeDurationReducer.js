// Action Types

// Initial State
const initialState = {
  duration: 0
}

// Reducer
const TimeDurationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TIME_DURATION':
      return {
        ...state,
        duration: action.payload
      }
    case 'RESET_DURATION':
      return initialState
    default:
      return state
  }
}

export default TimeDurationReducer
