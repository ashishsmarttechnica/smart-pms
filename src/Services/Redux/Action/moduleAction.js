import { axiosClient } from '../../Axios/Axios'

export const getProjectModulea = (projectId) => async (dispatch) => {

  const token = localStorage.getItem('token')
  try {
    dispatch({ type: 'MODULE_LIST_LOADING' })
    const { data } = await axiosClient.get(`project/modules?id=${projectId}`, {
      headers: {
        token: token
      }
    })

    if (data.success) {
      dispatch({ type: 'GET_MODULE_LIST', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    dispatch({ type: 'GET_MODULE_LIST', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'MODULE_LIST_ERROR', payload: error.message })
    dispatch({ type: 'GET_MODULE_LIST', payload: [] })

    return {
      success: false,
      data: []
    }
  }
}


