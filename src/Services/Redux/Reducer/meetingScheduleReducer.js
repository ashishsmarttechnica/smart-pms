const initialState = {
  meetingSchedule: [],
  loading: false,
  error: null
}

const meetingScheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MEETING_SCHEDULE_LOADING':
      return { ...state, loading: true, error: null }
    case 'GET_MEETING_SCHEDULE':
      return { ...state, loading: false, meetingSchedule: action.payload }
    case 'MEETING_SCHEDULE_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default meetingScheduleReducer
