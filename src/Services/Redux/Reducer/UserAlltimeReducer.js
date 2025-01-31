const initialState = {
  data: [],
  loading: false,
  error: null
}

const UserAlltimeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USERTIME_LIST_LOADING':
      return { ...state, loading: true, error: null }
    case 'GET_USERTIME_LIST':
      return { ...state, loading: false, data: action.payload }
    case 'USERTIME_LIST_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default UserAlltimeReducer
