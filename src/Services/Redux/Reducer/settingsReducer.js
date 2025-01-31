const initialState = {
  data: [],
  loading: false,
  error: null,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SETTING_DATA_LOADING":
      return { ...state, loading: true, error: null };
    case "GET_SETTING_DATA":
      return { ...state, loading: false, data: action.payload };
    case "SETTING_DATA_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default settingsReducer;
