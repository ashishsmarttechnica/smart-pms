import React, { useState } from 'react'
import { Modal, Button, SelectPicker, Input, Whisper, Tooltip } from 'rsuite'
import { FaPlus, FaTrash } from 'react-icons/fa' // Import icons
import { useDispatch } from 'react-redux'
import { reopneTask } from '../../../../../../Services/Redux/Action/ReopenAction'
import { toast } from 'react-toastify'
import { getTaskList } from '../../../../../../Services/Redux/Action/TaskAction'

const ReOpenModal = ({ reOpenModal, setReOpenModal, data }) => {
  const [tasks, setTasks] = useState([{ taskName: '', label: 'bug' }])
  const [errors, setErrors] = useState([]) // State to store error messages for each task
  const dispatch = useDispatch()
  const options = [
    { label: 'Bug', value: 'bug' },
    { label: 'Improvement', value: 'improvement' }
  ]

  const priorityColors = {
    High: 'bg-red-500', // Red for High priority
    Medium: 'bg-yellow-500', // Yellow for Medium priority
    Low: 'bg-green-500' // Green for Low priority
  }


  // Handle task value changes
  const handleFieldChange = (index, field, value) => {
    const updatedTasks = [...tasks]
    updatedTasks[index][field] = value
    setTasks(updatedTasks)

    // Clear error when user modifies the input
    if (field === 'taskName' && value.trim() !== '') {
      const updatedErrors = [...errors]
      updatedErrors[index] = null // Remove the error for this task
      setErrors(updatedErrors)
    }
  }

  // Add a new task row
  const addTask = () => {
    let valid = true
    const updatedErrors = tasks.map((task) =>
      task.taskName.trim() === '' ? 'Task name is required' : null
    )

    setErrors(updatedErrors)

    // Check if there are any errors
    updatedErrors.forEach((error) => {
      if (error) valid = false
    })
    if (valid) {
      const newTask = { taskName: '', label: 'bug' }
      setTasks([...tasks, newTask])
      setErrors([...errors, null]) // Add an entry in the error state for the new task
    }
  }

  // Remove a task row
  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
    const updatedErrors = errors.filter((_, i) => i !== index)
    setErrors(updatedErrors)
  }

  // Handle the submit event for reopening tasks
  const hendleSubmitReOpen = () => {
    let valid = true
    const updatedErrors = tasks.map((task) =>
      task.taskName.trim() === '' ? 'Task name is required' : null
    )

    setErrors(updatedErrors)

    // Check if there are any errors
    updatedErrors.forEach((error) => {
      if (error) valid = false
    })

    if (valid) {
      dispatch(reopneTask(tasks, data._id)).then((res) => {
        if (res.success) {
          setReOpenModal(false)
          toast.success(res.data.message)
          setTasks([{ taskName: '', label: 'bug' }])
          dispatch(getTaskList('7,8,9'))
        }
      })
    }
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
        <div className="overflow-x-auto min-h-[240px]">
          <table className="min-w-full bg-white border ">
            <thead className="bg-gray-600 whitespace-nowrap">
              <tr className="py-2">
                <th className="pl-4 py-2 text-left text-sm font-medium text-white">Task Name</th>
                <th className="pl-4 text-left text-sm font-medium text-white w-[180px]">Label</th>
                <th className="pl-4 text-left text-sm font-medium text-white w-[110px]">Actions</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  className="even:bg-slate-100 odd:bg-gray-50 border-t border-gray-300"
                >
                  <td className="p-4 text-sm ">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Task Name"
                        value={task.taskName}
                        onChange={(value) => handleFieldChange(index, 'taskName', value)}
                        className={`${
                          errors[index] ? '!border-red-500  !outline-red-200' : 'border-gray-300'
                        } w-full border px-2 py-1 rounded-md`}
                      />
                      {errors[index] && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2  w-fit bg-red-400 text-white text-xs py-1 px-2 rounded-sm ">
                          {errors[index]}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    <SelectPicker
                      data={options}
                      value={task.label}
                      onChange={(value) => handleFieldChange(index, 'label', value)}
                      placeholder="Select Label"
                      className="w-full"
                      size="md"
                      cleanable={false}
                      searchable={false}
                    />
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-2">
                      {/* Remove Task Button (Red: #ea4335) */}
                      {tasks.length > 1 && (
                        <button
                          onClick={() => removeTask(index)}
                          className="rounded-md bg-[#ea4335] p-2 border-2 border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-[#ea4335] focus:ring-opacity-50 active:bg-[#d43f2a] active:border-[#d43f2a] hover:bg-[#d43f2a] hover:border-[#d43f2a] active:ring-[#ba3c1f] disabled:pointer-events-none disabled:opacity-50"
                        >
                          <FaTrash className="icon text-white" />
                        </button>
                      )}

                      {/* Add Task Button (Green: #1f994e) */}
                      {index === tasks.length - 1 && (
                        <button
                          onClick={addTask}
                          className="rounded-md bg-[#1f994e] p-2 border-2 border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-[#1f994e] focus:ring-opacity-50 active:bg-[#178b42] active:border-[#178b42] hover:bg-[#178b42] hover:border-[#178b42] active:ring-[#136e33] disabled:pointer-events-none disabled:opacity-50"
                        >
                          <FaPlus className="icon text-white" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default ReOpenModal
