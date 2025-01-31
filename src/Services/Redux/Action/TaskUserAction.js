import { axiosClient } from './../../Axios/Axios'

export const getTaskUserList = (singleTask) => async (dispatch) => {
  try {
    dispatch({ type: 'TASKUSER_LIST_LOADING' })
    const token = localStorage.getItem('token')
    const { data } = await axiosClient.get(`/get/project?id=${singleTask.project_id}`, {
      token: token
    })

    if (data.success) {
      dispatch({ type: 'GET_TASKUSER_LIST', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    dispatch({ type: 'GET_TASKUSER_LIST', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'TASKUSER_LIST_ERROR', payload: error.message })

    return {
      success: false,
      data: []
    }
  }
}
export const TaskForwardUser = (singleTask) => async (dispatch) => {
  try {
    // dispatch({ type: 'TASKUSER_LIST_LOADING' })
    // http://192.168.1.19:2911/api/v1/task/forward?id=671b4137a4f9fa64a8600fd4&userId=67176887e8eaca941f9869cf
    const token = localStorage.getItem('token')
    const forwardedId = localStorage.getItem('userId')
    const { data } = await axiosClient.get(
      `/task/forward?id=${singleTask.task_id}&userId=${singleTask.userId}&forwardedId=${forwardedId}&role=${singleTask.role}`,
      {
        token: token
      }
    )

    if (data.success) {
      //   dispatch({ type: 'GET_TASKUSER_LIST', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    // dispatch({ type: 'GET_TASKUSER_LIST', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    // dispatch({ type: 'TASKUSER_LIST_ERROR', payload: error.message })
    console.log(error)

    return {
      success: false,
      data: []
    }
  }
}
