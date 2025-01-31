import { axiosClient } from '../../Axios/Axios'

export const reopneTask = (Reopndata, taskId) => async () => {
  const token = localStorage.getItem('token')

  try {
    const { data } = await axiosClient.post(
      `/reopen/task?taskId=${taskId}`,
      { tasks: Reopndata },
      {
        headers: {
          token: token
        }
      }
    )
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

export const singlereopneTask = (Reopndata, taskId) => async () => {
  const token = localStorage.getItem('token')

  // Create FormData object
  const formData = new FormData()
  // Append the task data to FormData
  formData.append('taskName', Reopndata.title)
  formData.append('label', Reopndata.label)
  formData.append('task_description', Reopndata.description)

  if (Reopndata.files && Reopndata.files.length > 0) {
    Reopndata.files.forEach((file, index) => {
      formData.append('task_img', file)
    })
  }

  try {
    const { data } = await axiosClient.post(`/reopen/task?taskId=${taskId}`, formData, {
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
