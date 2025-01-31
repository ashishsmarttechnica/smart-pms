const initialState = {
    moduleList: [],
    loading: false,
    error: null
  }

  const moduleReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'MODULE_LIST_LOADING':
        return { ...state, loading: true, error: null }
      case 'GET_MODULE_LIST':
        return { ...state, loading: false, moduleList: action.payload }
      case 'MODULE_LIST_ERROR':
        return { ...state, loading: false, error: action.payload }
      default:
        return state
    }
  }

  export default moduleReducer
