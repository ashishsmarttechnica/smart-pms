const initialState = {
  taskTimers: [],
  loading: false,
  error: null
}

const taskTimerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TASK_TIMER_LOADING':
      return { ...state, loading: true, error: null }
    case 'CREATE_TASK_TIMER':
      return {
        ...state,
        loading: false,
        taskTimers: [...state.taskTimers, action.payload],
        error: null
      }

    case 'UPDATE_TASK_TIMER':
      return {
        ...state,
        loading: false,
        taskTimers: state.taskTimers.map((timer) =>
          timer.id === action.payload.id ? action.payload : timer
        ),
        error: null
      }
    case 'TASK_TIMER_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default taskTimerReducer
