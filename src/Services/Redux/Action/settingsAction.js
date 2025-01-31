import { axiosClient } from "../../Axios/Axios";

export const getSettingsDetails = () => async (dispatch) => {
  const user_id = localStorage.getItem("userId");
  try {
    dispatch({ type: "SETTING_DATA_LOADING" });
    const { data } = await axiosClient.get(`/get/global/settings`);
    dispatch({ type: "GET_SETTING_DATA", payload: data.data });
  } catch (error) {
    console.error(error);
    dispatch({ type: "SETTING_DATA_ERROR", payload: error.message });
  }
};
