const initialState = {
  singleTask: [],
  loading: false,
  error: null
}

const singleTaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SINGLE_TASK_LIST_LOADING':
      return { ...state, loading: true, error: null }
    case 'GET_SINGLE_TASK_LIST':
      return { ...state, loading: false, singleTask: action.payload, error: null }
    case 'SINGLE_TASK_LIST_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default singleTaskReducer
