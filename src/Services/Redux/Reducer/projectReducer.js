const initialState = {
  projectList: [],
  loading: false,
  error: null
}

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PROJECT_LIST_LOADING':
      return { ...state, loading: true, error: null }
    case 'GET_PROJECT_LIST':
      return { ...state, loading: false, projectList: action.payload }
    case 'PROJECT_LIST_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default projectReducer
