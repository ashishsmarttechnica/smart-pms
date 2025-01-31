import { axiosClient } from '../../Axios/Axios'

export const getTeamMembers =
  (search = '') =>
  async (dispatch) => {
    const token = localStorage.getItem('token')
    const companyId = localStorage.getItem('companyId')
    try {
      dispatch({ type: 'TEAM_MEMBERS_LOADING' })
      const { data } = await axiosClient.get(`/company/users?id=${companyId}&search=${search}`, {
        headers: {
          token: token
        }
      })

      if (data.success) {
        dispatch({ type: 'GET_TEAM_MEMBERS', payload: data.data })
        return {
          success: true,
          data: data.data
        }
      }
      dispatch({ type: 'GET_TEAM_MEMBERS', payload: [] })
      return {
        success: false,
        data: []
      }
    } catch (error) {
      dispatch({ type: 'TEAM_MEMBERS_ERROR', payload: error.message })
      dispatch({ type: 'GET_TEAM_MEMBERS', payload: [] })

      return {
        success: false,
        data: []
      }
    }
  }

export const getTeamManager =
  (search = '') =>
  async (dispatch) => {
    const token = localStorage.getItem('token')
    const companyId = localStorage.getItem('companyId')
    try {
      dispatch({ type: 'TEAM_MANAGER_LOADING' })
      const { data } = await axiosClient.get(`/company/users?id=${companyId}&search=${search}`, {
        headers: {
          token: token
        }
      })

      if (data.success) {
        dispatch({ type: 'GET_TEAM_MANAGER', payload: data.data })
        return {
          success: true,
          data: data.data
        }
      }
      dispatch({ type: 'GET_TEAM_MANAGER', payload: [] })
      return {
        success: false,
        data: []
      }
    } catch (error) {
      dispatch({ type: 'TEAM_MANAGER_ERROR', payload: error.message })
      dispatch({ type: 'GET_TEAM_MANAGER', payload: [] })

      return {
        success: false,
        data: []
      }
    }
  }
