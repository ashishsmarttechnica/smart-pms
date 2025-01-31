import { axiosClient } from '../../Axios/Axios'
const token = localStorage.getItem('token')
export const createTaskTimer = (timerData) => async (dispatch) => {
  try {
    dispatch({ type: 'TASK_TIMER_LOADING' })
    const { data } = await axiosClient.post(
      '/create/tasktimer',
      {
        user_id: timerData.user_id,
        task_id: timerData.task_id,
        startdate: timerData.startdate,
        type: 'running'
      },
      {
        headers: {
          token: token
        }
      }
    )

    dispatch({ type: 'CREATE_TASK_TIMER', payload: data.data })

    return {
      success: true,
      data: data.data
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'TASK_TIMER_ERROR', payload: error.message })
    return {
      success: false,
      error: error.message
    }
  }
}


export const updateTaskTimer = (timerData) => async (dispatch) => {
  try {
    dispatch({ type: 'TASK_TIMER_LOADING' })
    const timerId = localStorage.getItem('TaskTimerId')
    const { data } = await axiosClient.put(
      `/update/tasktimer?id=${timerId}`,
      {
        user_id: timerData.user_id,
        task_id: timerData.task_id,
        startdate: timerData.startdate,
        enddate: timerData.enddate,
        type: 'running',
        duration: timerData.duration
      },
      {
        headers: {
          token: token
        }
      }
    )

    dispatch({ type: 'UPDATE_TASK_TIMER', payload: data.data })

    return {
      success: true,
      data: data.data
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'TASK_TIMER_ERROR', payload: error.message })
    return {
      success: false,
      error: error.message
    }
  }
}
