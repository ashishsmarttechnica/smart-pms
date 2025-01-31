import { axiosClient } from '../../Axios/Axios'

export const adminLogin = (formData) => async (dispatch) => {
  try {
    dispatch({ type: 'ADMIN_LOADING' })
    const { data } = await axiosClient.post('/login', formData)

    if (data.success) {
      dispatch({ type: 'ADMIN_LOGIN', payload: data.data.data })
      return {
        success: true,
        message: data.data.message || 'User Login Successfully',
        data: data.data.data
      }
    } else {
      throw new Error(data.message || 'Login failed')
    }
  } catch (error) {
    dispatch({ type: 'ADMIN_ERROR', payload: error.message })
    return {
      success: false,
      message: error.message || 'Something went wrong'
    }
  }
}

export const getAdminDetails = (token) => async (dispatch) => {
  try {
    dispatch({ type: 'ADMIN_LOADING' })

    const { data } = await axiosClient.post('/token/verify', { token })
    // localStorage.setItem('user_id', data.data._id)
    dispatch({ type: 'ADMIN_DETAILS', payload: data.data })
    return {
      success: true,
      message: 'User Login Successfully',
      data: {
        ...data.data,
        scrumnoteData: data.scrumnoteData,
        date: data.date
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Something went wrong'
    }
  }
}


