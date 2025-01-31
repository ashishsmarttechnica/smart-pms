import { axiosClient } from '../../Axios/Axios'

export const getSingleUser = () => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  try {
    dispatch({ type: 'SINGLE_USER_LOADING' })
    const { data } = await axiosClient.get(`/get/user?id=${userid}`, {
      headers: {
        token: token
      }
    })

    if (data.success) {
      dispatch({ type: 'GET_SINGLE_USER', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    dispatch({ type: 'GET_SINGLE_USER', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'SINGLE_USER_ERROR', payload: error.message })
    dispatch({ type: 'GET_SINGLE_USER', payload: [] })

    return {
      success: false,
      data: []
    }
  }
}
