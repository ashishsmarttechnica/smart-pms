import { axiosClient } from '../../Axios/Axios'

export const getUserProjects = () => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  try {
    dispatch({ type: 'PROJECT_LIST_LOADING' })
    const { data } = await axiosClient.get(`/user/projects?id=${userid}`, {
      headers: {
        token: token
      }
    })

    if (data.success) {
      dispatch({ type: 'GET_PROJECT_LIST', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    dispatch({ type: 'GET_PROJECT_LIST', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'PROJECT_LIST_ERROR', payload: error.message })
    dispatch({ type: 'GET_PROJECT_LIST', payload: [] })

    return {
      success: false,
      data: []
    }
  }
}


