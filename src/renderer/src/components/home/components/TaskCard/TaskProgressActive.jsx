// import React, { useContext, useEffect, useState } from 'react'
// import { Tooltip, Whisper } from 'rsuite'
// import ActiveTabContext from '../../../../Context/ActiveTabContext'
// import { useDispatch } from 'react-redux'
// import { updateTaskisCritical } from '../../../../../../Services/Redux/Action/TaskAction'

// // TaskProgressActive component
// const TaskProgressActive = ({ val, defaultColor = '#E4E4E4' }) => {
//   // Helper function to calculate percentage
//   const calculatePercentage = (time, totalTime) => (time / totalTime) * 100
//   const dispatch = useDispatch()
//   // State to store progress data and current total time
//   const { activeTab } = useContext(ActiveTabContext)
//   const [progressData, setProgressData] = useState({})
//   const [currentTotalTime, setCurrentTotalTime] = useState(val.total_time_spent_by_user)
//   const [timeValuesState, setTimeValuesState] = useState([])
//   // Function to generate progress data
//   const getProgressData = (currentTime) => {
//     const totalTime = Math.max(val.total_time, currentTime)
//     const timeValues = [
//       { time: val.est_time, name: 'Estimation Time' },
//       { time: val.pm_time, name: 'Project Manager Time' },
//       { time: val.critical_time, name: 'Critical Time' },
//       { time: totalTime, name: 'Total Time' }
//     ]

//     // Sort time values in descending order
//     timeValues.sort((a, b) => b.time - a.time)

//     setTimeValuesState(timeValues)

//     const colors = ['#000', '#FF0000', '#EF980B', '#0E7C26']
//     timeValues.forEach((item, index) => {
//       item.color = colors[index]
//     })

//     const progressData = {}
//     timeValues.forEach(({ color, time }) => {
//       progressData[color] = Math.min(
//         calculatePercentage(currentTotalTime, totalTime),
//         calculatePercentage(time, totalTime)
//       )
//     })

//     return progressData
//   }

//   const handlePauseTask = (id) => {
//     const isCritical = true
//     return dispatch(updateTaskisCritical(id, 3, isCritical)).then((res) => {
//       // 3 is paused status
//       if (res.success) {
//       }
//     })
//   }

//   const storedTime = localStorage.getItem('curruntTotalTime')
//   const activeTaskId = localStorage.getItem('activeTaskId')
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (activeTaskId) {
//         setCurrentTotalTime(storedTime)
//         if (val.critical_time == currentTotalTime) {
//           handlePauseTask(activeTaskId)
//         }
//         // Update progress data
//         setProgressData(getProgressData(currentTotalTime))
//       }
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [val, currentTotalTime, activeTab])

//   const colors = Object.keys(progressData)
//   const totalWidth = 991
//   const segments = colors.map((color) => Math.min(progressData[color] || 0, 100))
//   const segmentWidths = segments.map((percentage) => (percentage / 100) * totalWidth)

//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="991"
//       height="12"
//       viewBox="0 0 991 12"
//       fill="none"
//       className="w-full"
//     >
//       <rect width="991" height="12" rx="6" fill={defaultColor} />
//       {segmentWidths.map((width, index) => {
//         const color = colors[index]
//         const percentage = progressData[color]?.toFixed(2) || 0

//         return (
//           <Whisper
//             key={index}
//             trigger="hover"
//             placement="top"
//             followCursor
//             speaker={<Tooltip>{`${percentage}% ${timeValuesState[index].name}`}</Tooltip>}
//           >
//             <rect
//               width={width || 0}
//               height="12"
//               rx="6"
//               fill={color}
//               className="transition-all duration-[1s] ease-in-out"
//             />
//           </Whisper>
//         )
//       })}
//     </svg>
//   )
// }

// export default TaskProgressActive

import React, { useContext, useEffect, useRef, useState } from 'react'
import { Tooltip, Whisper } from 'rsuite'
import ActiveTabContext from '../../../../Context/ActiveTabContext'
import { useDispatch } from 'react-redux'
import { updateTaskisCritical } from '../../../../../../Services/Redux/Action/TaskAction'
import { toast } from 'react-toastify'
import calculateDuration from '../../../../utils/calculateDuration'
import { updateTaskTimer } from '../../../../../../Services/Redux/Action/TaskTimerAction'

const TaskProgressActive = ({ val, defaultColor = '#E4E4E4' }) => {
  const calculatePercentage = (time, totalTime) => (time / totalTime) * 100
  const dispatch = useDispatch()
  const { activeTab } = useContext(ActiveTabContext)
  const hasPausedRef = useRef(false)
  const hasESTimeStopRef = useRef(false)
  const hasPMTimeStopRef = useRef(false)
  // States to store progress data and current total time
  const [progressData, setProgressData] = useState({})
  const [currentTotalTime, setCurrentTotalTime] = useState(
    Number(localStorage.getItem('curruntTotalTime')) || val.total_time_spent_by_user
  )
  const activeTaskId = localStorage.getItem('activeTaskId')
  const [timeValuesState, setTimeValuesState] = useState([])
  const [hasPaused, setHasPaused] = useState(false) // Flag to track task pause
  const [hasESTimeStop, setHasESTimeStop] = useState(false) // Flag to track task pause
  const [hasPMTimeStop, setHasPMTimeStop] = useState(false) // Flag to track task pause

  // Function to generate progress data
  const getProgressData = (currentTime) => {
    const totalTime = Math.max(val.total_time, currentTime)
    const timeValues = [
      { time: val.est_time, name: 'Estimation Time' },
      { time: val.pm_time, name: 'Project Manager Time' },
      { time: val.critical_time, name: 'Critical Time' },
      { time: totalTime, name: 'Total Time' }
    ]

    // Sort time values in descending order
    timeValues.sort((a, b) => b.time - a.time)

    setTimeValuesState(timeValues)

    const colors = ['#000', '#FF0000', '#EF980B', '#0E7C26']
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
  const handlePauseTask = (id) => {
    if (val.total_time_spent_by_user >= val.critical_time) return Promise.resolve()
    if (hasPausedRef.current) return Promise.resolve()
    const isCritical = true

    // return dispatch(updateTaskisCritical(id, 3, isCritical)).then((res) => {
    //   if (res.success) {
    //     toast.warn('Task paused due to critical time.')
    //     hasPausedRef.current = true // Update ref instead of state
    //     setHasPaused(true) // Optional: Update state if needed for UI
    //   }
    // })

    return dispatch(
      updateTaskTimer({
        user_id: localStorage.getItem('userId'),
        task_id: localStorage.getItem('activeTaskId'),
        startdate: localStorage.getItem('startedTaskDate'),
        enddate: localStorage.getItem('LastEndTime'),
        duration: calculateDuration(
          localStorage.getItem('startedTaskDate'),
          localStorage.getItem('LastEndTime')
        )
      })
    ).then((res) => {
      if (res.success) {
        dispatch(updateTaskisCritical(id, 3, isCritical)).then((res) => {
          if (res.success) {
            toast.warn('Task paused due to critical time.')
            hasPausedRef.current = true // Update ref instead of state
            setHasPaused(true) // Optional: Update state if needed for UI
          }
        })
      }
    })
  }

  const handleUpdateTask = (id) => {
    if (val.est_time <= val.total_time_spent_by_user) return Promise.resolve()
    if (hasESTimeStopRef.current) return Promise.resolve()

    return dispatch(
      updateTaskTimer({
        user_id: localStorage.getItem('userId'),
        task_id: localStorage.getItem('activeTaskId'),
        startdate: localStorage.getItem('startedTaskDate'),
        enddate: localStorage.getItem('LastEndTime'),
        duration: calculateDuration(
          localStorage.getItem('startedTaskDate'),
          localStorage.getItem('LastEndTime')
        )
      })
    ).then((res) => {
      if (res.success) {
        toast.warn('Task has been updated due to estimated time.')
        hasESTimeStopRef.current = true // Update ref instead of state
        setHasESTimeStop(true) // Optional: Update state if needed for UI
      }
    })
  }
  const handleUpdatePMTask = (id) => {
    if (val.pm_time <= val.total_time_spent_by_user) return Promise.resolve()
    if (hasPMTimeStopRef.current) return Promise.resolve()

    return dispatch(
      updateTaskTimer({
        user_id: localStorage.getItem('userId'),
        task_id: localStorage.getItem('activeTaskId'),
        startdate: localStorage.getItem('startedTaskDate'),
        enddate: localStorage.getItem('LastEndTime'),
        duration: calculateDuration(
          localStorage.getItem('startedTaskDate'),
          localStorage.getItem('LastEndTime')
        )
      })
    ).then((res) => {
      if (res.success) {
        toast.warn('Task has been updated due to PM time.')

        hasPMTimeStopRef.current = true // Update ref instead of state
        setHasPMTimeStop(true) // Optional: Update state if needed for UI
      }
    })
  }

  // Effect to update progress every second
  useEffect(() => {
    const interval = setInterval(() => {
      const storedTime = Number(localStorage.getItem('curruntTotalTime')) || currentTotalTime
      setCurrentTotalTime(storedTime + 1)

      if (activeTaskId) {
        if (val.critical_time <= storedTime + 1 && !hasPaused) {
          handlePauseTask(activeTaskId).then(() => clearInterval(interval)) // Clear interval
        }
        if (val.est_time <= storedTime + 1 && !hasESTimeStop) {
          handleUpdateTask(activeTaskId).then(() => clearInterval(interval)) // Clear interval
        }
        if (val.pm_time <= storedTime + 1 && !hasPMTimeStop) {
          handleUpdatePMTask(activeTaskId).then(() => clearInterval(interval)) // Clear interval
        }

        setProgressData(getProgressData(storedTime + 1))
      }
    }, 1000)

    return () => clearInterval(interval) // Cleanup on unmount
  }, [currentTotalTime, val, activeTab, hasPaused, hasESTimeStop])

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

export default TaskProgressActive
