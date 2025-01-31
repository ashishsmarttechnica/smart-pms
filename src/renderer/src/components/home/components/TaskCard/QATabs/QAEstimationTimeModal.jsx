import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Modal, Button, InputNumber } from 'rsuite'
import { toast } from 'react-toastify'
import {
  getTaskList,
  updateTaskQAEstimationTime
} from '../../../../../../../Services/Redux/Action/TaskAction'
import formatTime from '../../../../../utils/formatTime'

const QAEstimationTimeModal = ({ isOpen, onClose, task }) => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [error, setError] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Convert hours and minutes to numbers to handle string inputs
    const hoursValue = Number(hours) || 0
    const minutesValue = Number(minutes) || 0

    // Calculate total estimation time
    const totalMinutes = hoursValue * 60 + minutesValue
    const totalSeconds = totalMinutes * 60

    // Validation
    if (hoursValue < 0 || minutesValue < 0) {
      setError('Hours and minutes cannot be negative.')
      return
    }

    if (hoursValue === 0 && minutesValue === 0) {
      setError('At least one minute of estimation time is required.')
      return
    }

    if (totalMinutes === 0) {
      setError('At least one minute of estimation time is required.')
      return
    }

    // if (task.critical_time) {
    //   const criticalMinutes = task.critical_time / 60 // Assuming critical_time is in seconds

    //   if (totalMinutes >= criticalMinutes) {
    //     setError('Estimation time must be less than critical time.')
    //     return
    //   }
    // }

    setError('') // Clear previous error messages

    // Dispatch action to update task estimation time
    dispatch(updateTaskQAEstimationTime(task._id, totalSeconds, 7)).then((res) => {
      if (res.success) {
        toast.success('Estimation time updated successfully.')
        dispatch(getTaskList('6'))
        onClose()
      }
    })
  }

  return (
    <Modal open={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>Add Estimation Time</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-1">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <div>Task Title</div>
            <div className="text-xl font-medium">{task.task}</div>
          </div>
          <div className="flex justify-between w-full gap-2 h-full">
            <div className=" w-3/4 border p-1.5 h-auto shadow-sm">
              {task.task_description && task.task_description != '' && (
                <div className="h-full">
                  <div>Task description</div>
                  <div className="py-1 mt-1 custom-html-content cardOverflowStik  max-h-[280px] bg-white overflow-y-auto px-2.5  border  rounded-sm ">
                    <div dangerouslySetInnerHTML={{ __html: task.task_description }} />
                  </div>
                </div>
              )}
            </div>

            <div className="w-1/4 border p-1.5 h-auto shadow-sm ">
              <div className="flex gap-4 mb-4 flex-col">
                <div className="text-base font-medium text-black text-left flex-grow border p-1 px-2 rounded bg-red-500/50 border-red-500">
                  CR Time :{' '}
                  {task.testCritical_time
                    ? formatTime(task.testCritical_time)
                    : 'waiting for Critical time'}
                </div>
              </div>
              <div className="text-base font-medium text-black ml-1 mb-2">
                Enter Estimation Time
              </div>
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex-grow space-y-1">
                  <label className="input-label ml-1 ">
                    Hours <span className="text-red-500">*</span>
                  </label>
                  <InputNumber
                    value={hours}
                    onChange={(value) => setHours(value)}
                    min={0}
                    placeholder="Hours"
                    required
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <label className="input-label ml-1 ">
                    Minutes <span className="text-red-500">*</span>
                  </label>
                  <InputNumber
                    value={minutes}
                    onChange={(value) => setMinutes(value)}
                    min={0}
                    max={59}
                    placeholder="Minutes"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-end">{error}</p>} {/* Display error message */}
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose} appearance="subtle">
              Cancel
            </Button>
            <Button type="submit" appearance="primary">
              Save
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default QAEstimationTimeModal
