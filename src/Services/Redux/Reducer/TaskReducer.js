const initialState = {
  tasks: [],
  loading: false,
  error: null
}

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TASK_LIST_LOADING':
      return { ...state, loading: true, error: null }
    case 'GET_TASK_LIST':
      return { ...state, loading: false, tasks: action.payload, error: null }
    case 'ADD_TASK_FROM_SOCKET':
      return { ...state, loading: false, tasks: [action.payload, ...state.tasks], error: null }
    case 'UPDATE_TASK_FROM_SOCKET':
      return { ...state, loading: false, tasks: state.tasks.map((task) => task._id === action.payload._id ? action.payload : task), error: null }
    case 'DELETE_TASK_FROM_SOCKET':
      return { ...state, loading: false, tasks: state.tasks.filter((task) => task._id !== action.payload._id), error: null }
    case 'TASK_LIST_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default taskReducer
