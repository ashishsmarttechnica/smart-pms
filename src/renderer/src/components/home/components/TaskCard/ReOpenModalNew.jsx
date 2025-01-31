import React, { useContext, useState } from 'react'
import { Modal, Button, SelectPicker, Input, Whisper, Tooltip, Uploader, InputPicker } from 'rsuite'
import { FaPlus, FaTrash } from 'react-icons/fa' // Import icons
import { useDispatch } from 'react-redux'
import { reopneTask, singlereopneTask } from '../../../../../../Services/Redux/Action/ReopenAction'
import { toast } from 'react-toastify'
import { getTaskList } from '../../../../../../Services/Redux/Action/TaskAction'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import ActiveTabContext from '../../../../Context/ActiveTabContext'
import { updateTaskTimer } from '../../../../../../Services/Redux/Action/TaskTimerAction'
import calculateDuration from '../../../../utils/calculateDuration'

const ReOpenModalNew = ({ reOpenModal, setReOpenModal, data }) => {
  const dispatch = useDispatch()
  const { trackerWidget } = useContext(ActiveTabContext)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    label: 'bug',
    files: []
  })
  const [errors, setErrors] = useState({})

  const priorityColors = {
    High: 'bg-red-500', // Red for High priority
    Medium: 'bg-yellow-500', // Yellow for Medium priority
    Low: 'bg-green-500' // Green for Low priority
  }
  const options = [
    { label: 'Bug', value: 'bug' },
    { label: 'Improvement', value: 'improvement' }
  ]

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target

    // Reset error for the field if its value changes
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate task title
    if (!formData.title.trim()) newErrors.title = 'Task title is required.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // hendle Images

  const handleFileChange = (fileList) => {
    setFormData((prevState) => ({
      ...prevState,
      files: fileList.length > 0 ? fileList.map((file) => file.blobFile) : []
    }))
  }
  const handleRemoveFile = (file) => {
    // Remove the file from the state
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.key !== file.key) // Check if 'key' is the correct property
    }))
  }

  // Handle the submit event for reopening tasks
  const hendleSubmitReOpen = async (e) => {
    e.preventDefault()
    if (!validateForm()) return // Prevent submission if validation fails

    dispatch(singlereopneTask(formData, data._id)).then((res) => {
      const activeTaskId = localStorage.getItem('activeTaskId')
      const startedTaskDate = localStorage.getItem('startedTaskDate')
      if (activeTaskId) {
        dispatch(
          updateTaskTimer({
            user_id: localStorage.getItem('userId'),
            task_id: activeTaskId,
            startdate: startedTaskDate,
            enddate: new Date().toUTCString(),
            duration: calculateDuration(startedTaskDate, new Date().toUTCString())
          })
        ).then((res) => {
          if (res.success) {
            localStorage.removeItem('TaskTimerId')
            localStorage.removeItem('startedTaskDate')
            localStorage.removeItem('startedTaskDateForLoop')
            localStorage.removeItem('activeTaskId')
            localStorage.removeItem('curruntTotalTime')
            localStorage.removeItem('activeProjectId')
            localStorage.removeItem('updatedTaskDate')

            setReOpenModal(false)
            toast.success(res.data.message)
            setFormData({
              title: '',
              description: '',
              label: 'bug',
              files: []
            })
            dispatch(getTaskList('7,8,9'))
            trackerWidget(false)
          }
        })
      } else {
        if (res.success) {
          setReOpenModal(false)
          toast.success(res.data.message)
          setFormData({
            title: '',
            description: '',
            label: 'bug',
            files: []
          })
          dispatch(getTaskList('7,8,9'))
          trackerWidget(false)
        }
      }
    })
    // if (valid) {
    //     console.log("Sddsdsdsd");

    //     const activeTaskId = localStorage.getItem('activeTaskId')
    //     dispatch(reopneTask(tasks, data._id)).then((res) => {
    //       if (activeTaskId) {
    //         console.log('in active')

    //         dispatch(
    //           updateTaskTimer({
    //             user_id: localStorage.getItem('userId'),
    //             task_id: activeTaskId,
    //             startdate: startedTaskDate,
    //             enddate: new Date().toUTCString(),
    //             duration: calculateDuration(startedTaskDate, new Date().toUTCString())
    //           })
    //         ).then((res) => {
    //           if (res.success) {
    //             setReOpenModal(false)
    //             toast.success(res.data.message)
    //             setTasks([{ taskName: '', label: 'bug' }])
    //             dispatch(getTaskList('7,8,9'))
    //           }
    //         })
    //       } else {
    //         console.log('out active')
    //         if (res.success) {
    //           setReOpenModal(false)
    //           toast.success(res.data.message)
    //           setTasks([{ taskName: '', label: 'bug' }])
    //           dispatch(getTaskList('7,8,9'))
    //         }
    //       }
    //     })
    //     // dispatch(reopneTask(tasks, data._id)).then((res) => {
    //     //   if (res.success) {
    //     //     setReOpenModal(false)
    //     //     toast.success(res.data.message)
    //     //     setTasks([{ taskName: '', label: 'bug' }])
    //     //     dispatch(getTaskList('7,8,9'))
    //     //   }
    //     // })
    //   }
    // dispatch(singlereopneTask(formData, data._id)).then((res) => {
    //   if (res.success) {
    //     setReOpenModal(false)
    //     toast.success(res.data.message)
    //     setFormData({
    //       title: '',
    //       description: '',
    //       label: 'bug',
    //       files: []
    //     })
    //     dispatch(getTaskList('7,8,9'))
    //     trackerWidget(false)
    //   }
    // })
  }

  return (
    <Modal
      open={reOpenModal}
      onClose={() => setReOpenModal(false)}
      size="lg"
      backdrop="static"
      className="custom-modal"
    >
      <Modal.Header>
        <Modal.Title className="text-base font-semibold ">
          <div className="flex items-end w-full gap-3 relative">
            <Whisper
              placement="top" // Tooltip placement
              trigger="hover" // Trigger on hover
              speaker={<Tooltip> priority :- {data.priority}</Tooltip>} // Tooltip content
            >
              <div
                className={`h-[20px] w-[20px] rounded-full absolute top-1/2 left-1 -translate-y-1/2 ${
                  priorityColors[data.priority] || 'bg-yellow-500'
                }`}
              ></div>
            </Whisper>
            <div className="font-medium text-lg ml-8">{data.task}</div>{' '}
            <Whisper
              placement="right" // Tooltip placement
              trigger="hover" // Trigger on hover
              speaker={<Tooltip>{data.project_id?.name}</Tooltip>} // Tooltip content
            >
              <div className="border border-blue-500 bg-blue-100 py-0.5 px-1.5 text-[14px] rounded-sm cursor-pointer">
                {data.project_id?.name}
              </div>
            </Whisper>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-2" onSubmit={hendleSubmitReOpen}>
          <div className="flex space-x-2">
            <div className="flex-grow w-1/2">
              <label htmlFor="title" className=" ml-2 mb-1 block text-sm font-medium text-gray-700">
                Reopen Task Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={(value) => handleChange({ target: { name: 'title', value } })}
                placeholder="Task Title"
                className={`${errors.title && ' !border-red-500 !outline-red-100 '}`}
                id="title"
              />
              {errors.title && <p className="text-red-500 ml-1 mt-1">{errors.title}</p>}
            </div>
            <div className="flex-grow w-1/2">
              <label htmlFor="label" className="ml-2 mb-1 block text-sm font-medium text-gray-700">
                label
              </label>
              <InputPicker
                name="label"
                value={formData.label}
                onChange={(value) => handleChange({ target: { name: 'label', value } })}
                data={options.map((label) => ({
                  label: label.label,
                  value: label.value
                }))}
                block
                id="label"
                className={`${errors.label && ' !border-red-500 shadoeOnErrorRed '}`}
              />
              {errors.project && <p className="text-red-500 ml-1 mt-1">{errors.label}</p>}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="ml-2 mb-1 block text-sm font-medium text-gray-700"
            >
              Task Description
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(content) =>
                setFormData((prevData) => ({ ...prevData, description: content }))
              }
              placeholder="Task Description"
              id="description"
            />
          </div>
          <div className="space-y-2">
            <label className="input-label ml-1">Upload File</label>
            <Uploader
              autoUpload={false}
              action=" "
              listType="picture"
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              accept="image/*,video/*"
              className={`uploader-custom w-full border-dashed border rounded-md p-4 hover:border-primary ${
                errors.files && 'border-red-500'
              }`}
              draggable
              disabled={formData.files.length >= 5}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={hendleSubmitReOpen} appearance="primary">
          Save
        </Button>
        <Button onClick={() => setReOpenModal(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReOpenModalNew
