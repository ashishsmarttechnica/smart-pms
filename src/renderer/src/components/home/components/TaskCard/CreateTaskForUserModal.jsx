import React, { useContext, useEffect, useState } from 'react'
import { getUserProjects } from '../../../../../../Services/Redux/Action/ProjectAction'
import { useDispatch, useSelector } from 'react-redux'
// Import RSuite components
import { Input, InputNumber, InputPicker, DatePicker, Button, Modal, Uploader } from 'rsuite'
import {
  createTask,
  createTesterTask,
  getTaskList
} from '../../../../../../Services/Redux/Action/TaskAction'
import { toast } from 'react-toastify'
import ActiveTabContext from '../../../../Context/ActiveTabContext'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css' // Import Quill's default theme
import { getProjectModulea } from '../../../../../../Services/Redux/Action/moduleAction'

const CreateTaskForUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { projectList, loading } = useSelector((state) => state.projectList)
  const moduleList = useSelector((state) => state.moduleDetails.moduleList)
  const moduleloading = useSelector((state) => state.moduleDetails.loading)

  const { setActiveTab } = useContext(ActiveTabContext)
  const role = localStorage.getItem('role')

  const [formData, setFormData] = useState({
    project: '',
    module: '',
    manager: '',
    title: '',
    hours: 0,
    minutes: 0,
    date: new Date(),
    priority: 'Medium',
    type: 'Normal',
    description: '',
    files: []
  })

  const [errors, setErrors] = useState({})

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target

    // Reset error for the field if its value changes
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
    }

    if (name === 'project') {
      if (value != null) {
        dispatch(getProjectModulea(value))
      }
      if (formData.module != null) {
        setFormData((prevData) => ({
          ...prevData,
          module: ''
        }))
      }
      const selectedProject = projectList.find((project) => project._id === value)
      setFormData((prevData) => ({
        ...prevData,
        project: value,
        project_id: selectedProject?._id,
        manager: selectedProject?.project_manager.first_name || '',
        manager_id: selectedProject?.project_manager._id
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const typeOptions = [
    { label: 'Bug', value: 'Bug' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Improvement', value: 'Improvement' },
    { label: 'Changes', value: 'Changes' }
  ]

  const handleMinutesInput = (e) => {
    if (e.target.value.length > 2) {
      e.target.value = e.target.value.slice(0, 2) // Restrict input to 2 digits
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate project
    if (!formData.project) newErrors.project = 'Project is required.'
    // if (formData.project && !formData.module) newErrors.module = 'module is required.'
    if (!formData.type) newErrors.type = 'Type is required.'

    // Validate task title
    if (!formData.title.trim()) newErrors.title = 'Task title is required.'

    // Validate hours
    if (formData.hours < 0) {
      newErrors.hours = 'Hours must be 0 or more.'
    }

    // Validate minutes
    if (!formData.minutes && formData.hours < 0) {
      newErrors.minutes = 'Minutes are required.'
    } else if (formData.minutes < 0 || formData.minutes > 59) {
      newErrors.minutes = 'Minutes must be between 0 and 59.'
    }

    // Custom validation logic
    if (formData.hours == 0 && formData.minutes < 1) {
      newErrors.minutes = 'Minutes must be at least 1.'
    }

    // Validate date
    if (!formData.date) newErrors.date = 'Date is required.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return // Prevent submission if validation fails

    // Convert hours and minutes to seconds
    const totalSeconds = convertToSeconds(formData.hours, formData.minutes)

    if (role !== 'QA') {
      dispatch(createTask({ ...formData, totalSeconds })).then((res) => {
        if (res.data.success) {
          toast.success(res.data.message)
          dispatch(getTaskList('2,3,4'))
          resetForm() // Reset the form after successful submission
          onClose()
          setActiveTab('today')
        } else {
          toast.error(res.data.message)
        }
      })
    } else {
      dispatch(createTesterTask({ ...formData, totalSeconds })).then((res) => {
        if (res.data.success) {
          toast.success(res.data.message)
          dispatch(getTaskList('7,8,9'))
          resetForm()
          onClose()
          setActiveTab('testerToday')
        } else {
          toast.error(res.data.message)
        }
      })
    }
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
  const convertToSeconds = (hours, minutes) => {
    const hoursInSeconds = parseInt(hours || 0) * 3600
    const minutesInSeconds = parseInt(minutes || 0) * 60
    return hoursInSeconds + minutesInSeconds
  }

  const resetForm = () => {
    setFormData({
      project: '',
      module: '',
      manager: '',
      title: '',
      hours: 0,
      minutes: 0,
      date: new Date(),
      priority: 'Medium',
      type: 'Normal',
      description: '',
      files: []
    })
    setErrors({})
  }

  useEffect(() => {
    if (isOpen) {
      dispatch(getUserProjects())
    } else {
      resetForm() // Reset form when modal is closed
    }
  }, [isOpen, dispatch])

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Create New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pr-2 pl-1 ">
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <div className="w-2/3">
              <label htmlFor="title" className=" ml-2 mb-1 block text-sm font-medium text-gray-700">
                Task Title
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
            <div className="flex-grow w-1/3">
              <label htmlFor="type" className="ml-2 mb-1 block text-sm font-medium text-gray-700">
                Type
              </label>
              <InputPicker
                name="type"
                value={formData.type}
                onChange={(value) => handleChange({ target: { name: 'type', value } })}
                data={typeOptions.map((type) => ({
                  label: type.label,
                  value: type.value
                }))}
                cleanable={false}
                placeholder={loading ? 'Loading projects...' : 'Select type'}
                disabled={loading}
                block
                id="type"
                className={`${errors.type && ' !border-red-500 shadoeOnErrorRed '}`}
              />
              {errors.type && <p className="text-red-500 ml-1 mt-1">{errors.type}</p>}
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="flex-grow w-1/3">
              <label
                htmlFor="project"
                className="ml-2 mb-1 block text-sm font-medium text-gray-700"
              >
                Project
              </label>
              <InputPicker
                name="project"
                value={formData.project}
                onChange={(value) => handleChange({ target: { name: 'project', value } })}
                data={projectList.map((project) => ({
                  label: project.name,
                  value: project._id
                }))}
                placeholder={loading ? 'Loading projects...' : 'Add Project'}
                disabled={loading}
                block
                id="project"
                className={`${errors.project && ' !border-red-500 shadoeOnErrorRed '}`}
              />
              {errors.project && <p className="text-red-500 ml-1 mt-1">{errors.project}</p>}
            </div>

            <div className="flex-grow w-1/3">
              <label
                htmlFor="manager"
                className="ml-2 mb-1 block text-sm font-medium text-gray-700"
              >
                Manager
              </label>
              <InputPicker
                name="manager"
                value={formData.manager}
                onChange={(value) => handleChange({ target: { name: 'manager', value } })}
                data={[{ label: formData.manager, value: formData.manager }]} // Add manager options here
                placeholder="Manager"
                disabled
                block
                id="manager"
              />
            </div>
            <div className="flex-grow w-1/3">
              <label htmlFor="module" className="ml-2 mb-1 block text-sm font-medium text-gray-700">
                Module
              </label>
              <InputPicker
                name="module"
                value={formData.module}
                onChange={(value) => handleChange({ target: { name: 'module', value } })}
                data={moduleList.map((module) => ({
                  label: module.name,
                  value: module._id
                }))}
                placeholder={moduleloading ? 'Loading module...' : 'Select Module'}
                disabled={formData.project == null || formData.project == ''}
                block
                id="module"
                className={`${errors.module && ' !border-red-500 shadoeOnErrorRed '}`}
              />
              {errors.module && <p className="text-red-500 ml-1 mt-1">{errors.module}</p>}
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="w-1/3">
              <label htmlFor="hours" className="ml-2 mb-1 block text-sm font-medium text-gray-700">
                Hours
              </label>
              <InputNumber
                name="hours"
                value={formData.hours}
                onChange={(value) => handleChange({ target: { name: 'hours', value } })}
                placeholder="Hours"
                min={0}
                id="hours"
                className={`${errors.hours && ' !border-red-500 !outline-red-100 '}`}
              />
              {errors.hours && <p className="text-red-500 ml-1 mt-1">{errors.hours}</p>}
            </div>

            <div className="w-1/3">
              <label
                htmlFor="minutes"
                className="ml-2 mb-1 block text-sm font-medium text-gray-700"
              >
                Minutes
              </label>
              <InputNumber
                name="minutes"
                value={formData.minutes}
                onChange={(value) => handleChange({ target: { name: 'minutes', value } })}
                placeholder="Minutes"
                min={0}
                max={59}
                onInput={handleMinutesInput}
                id="minutes"
                className={`${errors.minutes && ' !border-red-500 !outline-red-100 '}`}
              />
              {errors.minutes && <p className="text-red-500 ml-1 mt-1">{errors.minutes}</p>}
            </div>

            <div className="w-1/3">
              <label htmlFor="date" className="ml-2 mb-1 block text-sm font-medium text-gray-700">
                Date
              </label>
              <DatePicker
                placement="auto"
                oneTap
                name="date"
                value={formData.date ? new Date(formData.date) : null}
                format="dd-MM-yyyy"
                shouldDisableDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                onChange={(value) =>
                  handleChange({
                    target: { name: 'date', value: value ? value.toUTCString() : '' }
                  })
                }
                block
                id="date"
                cleanable={false}
                className={`${errors.date && 'DateError'} '}`}
              />
              {errors.date && <p className="text-red-500 ml-1 mt-1">{errors.date}</p>}
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="w-2/3">
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
              {errors.description && <p className="text-red-500 ml-1 mt-1">{errors.description}</p>}
            </div>
            <div className=" w-1/3 space-y-2 h-auto">
              <label className="input-label ml-1">Upload File</label>
              <Uploader
                autoUpload={false}
                action=" "
                listType="picture"
                onChange={handleFileChange}
                onRemove={handleRemoveFile}
                accept="image/*,video/*"
                className={`uploader-custom w-full border-dashed border rounded-md p-2 hover:border-primary min-h-[84%] ${
                  errors.files && 'border-red-500'
                }`}
                draggable
                disabled={formData.files.length >= 5}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="mt-4">
        <Button onClick={handleSubmit} appearance="primary">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateTaskForUserModal
