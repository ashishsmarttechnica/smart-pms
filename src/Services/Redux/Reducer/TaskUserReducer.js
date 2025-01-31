const initialState = {
  data: [],
  loading: false,
  error: null
}

const TaskUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TASKUSER_LIST_LOADING':
      return { ...state, loading: true, error: null }
    case 'GET_TASKUSER_LIST':
      return { ...state, loading: false, data: action.payload }
    case 'TASKUSER_LIST_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default TaskUserReducer
