import { axiosClient } from '../../Axios/Axios'
const token = localStorage.getItem('token')

export const createNote = (notedata, activeTaskId) => async (dispatch) => {
  try {
    // Initialize FormData
    let formData = new FormData()
    formData.append('task_id', activeTaskId) // Append the active task ID
    formData.append('note', notedata) // Append note text

    // Append all media files to the form data
    if (notedata.files && notedata.files.length > 0) {
      notedata.files.forEach((file) => {
        formData.append('media', file)
      })
    }

    // Make the POST request to create a note
    const { data } = await axiosClient.post('/create/note', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set multipart/form-data
        Authorization: `Bearer ${token}` // Send token in headers if needed
      },
      maxBodyLength: Infinity // In case of large files
    })

    // Dispatch success or return result
    return {
      success: true,
      data: data.data
    }
  } catch (error) {
    console.error(error)

    // Return error result
    return {
      success: false,
      error: error.message
    }
  }
}
