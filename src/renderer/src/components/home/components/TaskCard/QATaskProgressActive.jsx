import React, { useContext, useEffect, useState } from 'react'
import { Tooltip, Whisper } from 'rsuite'
import ActiveTabContext from '../../../../Context/ActiveTabContext'
import { useDispatch } from 'react-redux'
import { updateTaskisCritical } from '../../../../../../Services/Redux/Action/TaskAction'
import { toast } from 'react-toastify'

const QATaskProgressActive = ({ val, defaultColor = '#E4E4E4' }) => {
  const calculatePercentage = (time, totalTime) => (time / totalTime) * 100
  const dispatch = useDispatch()
  const { activeTab } = useContext(ActiveTabContext)

  // States to store progress data and current total time
  const [progressData, setProgressData] = useState({})
  const [currentTotalTime, setCurrentTotalTime] = useState(Number(localStorage.getItem('curruntTotalTime')) || val.total_time_spent_by_user)
  const [timeValuesState, setTimeValuesState] = useState([])
  const [hasPaused, setHasPaused] = useState(false) // Flag to track task pause

  // Function to generate progress data
  const getProgressData = (currentTime) => {
    const totalTime = Math.max(val.testTotal_time, val.total_time_spent_by_user)

    const timeValues = [
        { time: val.testEst_time, name: 'Estimation Time' },
        { time: val.testCritical_time, name: 'Critical Time' },
        { time: totalTime, name: 'Total Time' }
      ]

    // Sort time values in descending order
    timeValues.sort((a, b) => b.time - a.time)


    setTimeValuesState(timeValues)

    const colors = ['#000', '#FF0000', '#0E7C26']
    timeValues.forEach((item, index) => {
      item.color = colors[index]
    })

    const progressData = {}
    timeValues.forEach(({ color, time }) => {
      progressData[color] = Math.min(
        calculatePercentage(currentTime, totalTime),
        calculatePercentage(time, totalTime)
      )
    })

    return progressData
  }

  // Handle task pause when critical time is reached
  const handlePauseTask = (id) => {
    const isCritical = true
    return dispatch(updateTaskisCritical(id, 8, isCritical)).then((res) => {
      // 3 is paused status
      if (res.success) {
        toast.warn('Task paused due to critical time.')
        setHasPaused(true) // Set the flag to true after pausing the task
      }
    })
  }

  // Effect to update progress every second
  useEffect(() => {
    const activeTaskId = localStorage.getItem('activeTaskId')

    const interval = setInterval(() => {
      const storedTime = Number(localStorage.getItem('curruntTotalTime')) || currentTotalTime

      // Update the total time
      setCurrentTotalTime(storedTime + 1) // Increment every second

      if (activeTaskId) {
        if (val.testCritical_time <= storedTime + 1 && !hasPaused) {
          handlePauseTask(activeTaskId) // Call the pause function once
        }
        // Update progress data
        setProgressData(getProgressData(storedTime + 1))
      }
    }, 1000)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval)
  }, [currentTotalTime, val, activeTab, hasPaused]) // Add hasPaused as a dependency

  const colors = Object.keys(progressData)
  const totalWidth = 991
  const segments = colors.map((color) => Math.min(progressData[color] || 0, 100))
  const segmentWidths = segments.map((percentage) => (percentage / 100) * totalWidth)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="991"
      height="12"
      viewBox="0 0 991 12"
      fill="none"
      className="w-full"
    >
      <rect width="991" height="12" rx="6" fill={defaultColor} />
      {segmentWidths.map((width, index) => {
        const color = colors[index]
        const percentage = progressData[color]?.toFixed(2) || 0

        return (
          <Whisper
            key={index}
            trigger="hover"
            placement="auto"
            preventOverflow
            followCursor
            speaker={<Tooltip>{`${percentage}% ${timeValuesState[index]?.name}`}</Tooltip>}
          >
            <rect
              width={width || 0}
              height="12"
              rx="6"
              fill={color}
              className="transition-all duration-[1s] ease-in-out"
            />
          </Whisper>
        )
      })}
    </svg>
  )
}

export default QATaskProgressActive