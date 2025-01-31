import { axiosClient } from '../../Axios/Axios'

export const getTaskList = (status) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  try {
    dispatch({ type: 'TASK_LIST_LOADING' })
    const { data } = await axiosClient.get(
      // `/user/tasks?id=${userid}&status=${status}&isApprove=true`,
      status ? `/user/tasks?id=${userid}&status=${status}` : `/user/tasks?id=${userid}`,
      {
        headers: {
          token: token
        }
      }
    )

    if (data.success) {
      dispatch({ type: 'GET_TASK_LIST', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    dispatch({ type: 'GET_TASK_LIST', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'TASK_LIST_ERROR', payload: error.message })
    dispatch({ type: 'GET_TASK_LIST', payload: [] })

    return {
      success: false,
      data: []
    }
  }
}

export const updateTaskisCritical = (taskId, status, isCritical) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  try {
    const { data } = await axiosClient.put(
      `/update/task?id=${taskId}`,
      { status: status, isCritical: isCritical ? true : false },
      {
        headers: {
          token: token
        }
      }
    )
    if (data.success) {
      return {
        success: true,
        data: data.data
      }
    }
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'TASK_LIST_ERROR', payload: error.message })
    return {
      success: false,
      data: []
    }
  }
}
export const updateTaskStatus = (taskId, status, glTime) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  try {
    const { data } = await axiosClient.put(
      `/update/task?id=${taskId}`,
      // { status: status },
      { status: status, completedDate: glTime ? glTime : new Date() },
      {
        headers: {
          token: token
        }
      }
    )
    if (data.success) {
      return {
        success: true,
        data: data.data
      }
    }
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'TASK_LIST_ERROR', payload: error.message })
    return {
      success: false,
      data: []
    }
  }
}
export const updateTaskEstimationTime = (taskId, totalSeconds, estStatus) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  try {
    const { data } = await axiosClient.put(
      `/update/task?id=${taskId}`,
      { est_time: totalSeconds, status: estStatus },
      {
        headers: {
          token: token
        }
      }
    )
    if (data.success) {
      return {
        success: true,
        data: data.data
      }
    }
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'TASK_LIST_ERROR', payload: error.message })
    return {
      success: false,
      data: []
    }
  }
}
export const updateTaskQAEstimationTime = (taskId, totalSeconds, estStatus) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  try {
    const { data } = await axiosClient.put(
      `/update/task?id=${taskId}`,
      {
        testEst_time: totalSeconds,
        status: estStatus,
        testCritical_time: totalSeconds + 30 * 60,
        testTotal_time: totalSeconds + 40 * 60
      },
      {
        headers: {
          token: token
        }
      }
    )
    if (data.success) {
      return {
        success: true,
        data: data.data
      }
    }
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'TASK_LIST_ERROR', payload: error.message })
    return {
      success: false,
      data: []
    }
  }
}
export const createTask = (taskData) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Create FormData object
  const formData = new FormData()

  // Append the task data to FormData
  formData.append('project_id', taskData.project_id)
  formData.append('due_date', taskData.date)
  formData.append('est_time', taskData.totalSeconds)
  formData.append('company_id', localStorage.getItem('companyId'))
  formData.append('total_assigns[0]', userid) // Assuming this is an array
  formData.append('pm_id', taskData.manager_id)
  formData.append('task', taskData.title)
  formData.append('type', taskData.type)
  formData.append('task_description', taskData.description)
  formData.append('status', 1)
  formData.append('priority', taskData.priority)
  formData.append('isApprove', false)
  formData.append('task_creator', userid)
  // Append the files to FormData
  if (taskData.module != '' && taskData.module != null) {
    formData.append('module_id', taskData.module)
  }
  if (taskData.files && taskData.files.length > 0) {
    taskData.files.forEach((file, index) => {
      formData.append('task_img', file)
    })
  }

  try {
    const { data } = await axiosClient.post(`create/task`, formData, {
      headers: {
        token: token
      }
    })
    if (data.success) {
      return {
        success: true,
        data: data
      }
    }
    return {
      success: false,
      data: []
    }
  } catch (error) {
    return {
      success: false,
      data: []
    }
  }
}
export const createTesterTask = (taskData) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Create FormData object
  const formData = new FormData()

  // Append the task data to FormData
  formData.append('project_id', taskData.project_id)
  formData.append('due_date', taskData.date)
  formData.append('testEst_time', taskData.totalSeconds)
  formData.append('company_id', localStorage.getItem('companyId'))
  formData.append('total_assigns[0]', userid) // Assuming this is an array
  formData.append('pm_id', taskData.manager_id)
  formData.append('task', taskData.title)
  formData.append('type', taskData.type)
  formData.append('task_description', taskData.description)
  formData.append('status', 7)
  formData.append('priority', taskData.priority)
  formData.append('isApprove', false)
  formData.append('task_creator', userid)
  // Append the files to FormData
  if (taskData.module != '' && taskData.module != null) {
    formData.append('module_id', taskData.module)
  }
  if (taskData.files && taskData.files.length > 0) {
    taskData.files.forEach((file, index) => {
      formData.append('task_img', file)
    })
  }

  try {
    const { data } = await axiosClient.post(`/create/testertask`, formData, {
      headers: {
        token: token
      }
    })
    if (data.success) {
      return {
        success: true,
        data: data
      }
    }
    return {
      success: false,
      data: []
    }
  } catch (error) {
    return {
      success: false,
      data: []
    }
  }
}
export const getTaskFromSocket = (task, type) => async (dispatch) => {
  if (type == 'add') {
    dispatch({ type: 'ADD_TASK_FROM_SOCKET', payload: task })
  } else if (type == 'update') {
    dispatch({ type: 'UPDATE_TASK_FROM_SOCKET', payload: task })
  } else if (type == 'delete') {
    dispatch({ type: 'DELETE_TASK_FROM_SOCKET', payload: task })
  } else {
    return null
  }
}

export const getSingleTaskList = (id) => async (dispatch) => {
  const userid = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  try {
    dispatch({ type: 'SINGLE_TASK_LIST_LOADING' })
    const { data } = await axiosClient.get(`/get/taskdetails?id=${id}`, {
      headers: {
        token: token
      }
    })

    if (data.success) {
      dispatch({ type: 'GET_SINGLE_TASK_LIST', payload: data.data })
      return {
        success: true,
        data: data.data
      }
    }
    dispatch({ type: 'GET_SINGLE_TASK_LIST', payload: [] })
    return {
      success: false,
      data: []
    }
  } catch (error) {
    dispatch({ type: 'SINGLE_TASK_LIST_ERROR', payload: error.message })
    dispatch({ type: 'GET_SINGLE_TASK_LIST', payload: [] })

    return {
      success: false,
      data: []
    }
  }
}
