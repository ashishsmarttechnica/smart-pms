const initialState = {
  loading: false,
  data: {},
  userLogin: false
}
export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADMIN_LOADING':
      return {
        ...state,
        loading: true
      }

    case 'ADMIN_LOGIN':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        loading: false,
        data: action.payload,
        userLogin: true
      }

    case 'ADMIN_DETAILS':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        loading: false,
        data: action.payload,
        userLogin: true
      }

    case 'ADMIN_LOGOUT':
      localStorage.clear()
      return {
        ...state,
        loading: false,
        data: {},
        userLogin: false
      }

    default:
      return {
        ...state,
        loading: false
      }
  }
}
