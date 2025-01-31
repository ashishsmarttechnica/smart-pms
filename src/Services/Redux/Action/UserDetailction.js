import { axiosClient } from '../../Axios/Axios'
export const getUserDetail = () => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  try {
    dispatch({ type: 'USERTIME_LIST_LOADING' })
    const { data } = await axiosClient.get(`/get/usertimer?id=${userid}`, {
      headers: {
        token: token
      }
    })

    if (data.success) {
      dispatch({ type: 'GET_USERTIME_LIST', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    dispatch({ type: 'GET_USERTIME_LIST', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'USERTIME_LIST_ERROR', payload: error.message })
    dispatch({ type: 'GET_USERTIME_LIST', payload: [] })

    return {
      success: false,
      data: []
    }
  }
}
