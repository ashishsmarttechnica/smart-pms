const initialState = {
  singleTask: [],
  loading: false,
  error: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SINGLE_USER_LOADING':
      return { ...state, loading: true, error: null }
    case 'GET_SINGLE_USER':
      return { ...state, loading: false, singleTask: action.payload, error: null }
    case 'SINGLE_USER_ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default userReducer
