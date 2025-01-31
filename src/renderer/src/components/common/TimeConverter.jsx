// import React, { useState, useEffect } from 'react'
// import formatTime from '../../utils/formatTime'
// import calculateDuration from '../../utils/calculateDuration'

// const TimeConverter = ({ initialSeconds, isActive, isTaskActive, isdatatime }) => {
//   const [seconds, setSeconds] = useState(initialSeconds)
//   // useEffect(() => {
//   //   let timer
//   //   if (isTaskActive) {
//   //     timer = setInterval(() => {
//   //       const duration = calculateDuration(
//   //         localStorage.getItem('startedTaskDate'),
//   //         localStorage.getItem('LastEndTime')
//   //       )

//   //       localStorage.setItem('curruntTotalTime2', isdatatime + duration)
//   //     }, 1000)
//   //   }
//   //   return () => clearInterval(timer)
//   // }, [isActive])

//   // useEffect(() => {
//   //   let timer
//   //   if (isActive) {
//   //     timer = setInterval(() => {
//   //       if (
//   //         localStorage.getItem('startedTaskId') &&
//   //         localStorage.getItem('startedTaskDate') &&
//   //         localStorage.getItem('activeTaskId')
//   //       ) {
//   //         localStorage.setItem('LastEndTime', new Date().toUTCString())
//   //       }

//   //       localStorage.setItem('LastEndTime', new Date().toUTCString())
//   //       setSeconds((prevSeconds) => prevSeconds + 1)
//   //     }, 1000)
//   //   }
//   //   return () => clearInterval(timer)
//   // }, [isActive])

//   useEffect(() => {
//     let timer
//     if (isActive) {
//       timer = setInterval(() => {
//         if (
//           localStorage.getItem('startedTaskId') &&
//           localStorage.getItem('startedTaskDate') &&
//           localStorage.getItem('activeTaskId')
//         ) {
//           localStorage.setItem('LastEndTime', new Date().toUTCString())
//         }
//         const duration = calculateDuration(
//           localStorage.getItem('startedTaskDate'),
//           localStorage.getItem('LastEndTime')
//         )
//         localStorage.setItem('LastEndTime', new Date().toUTCString())
//         setSeconds(duration + isdatatime)
//       }, 1000)
//     }
//     return () => clearInterval(timer)
//   }, [isActive])

//   useEffect(() => {
//     setSeconds(initialSeconds)
//   }, [initialSeconds])

//   const activeTaskId = localStorage.getItem('activeTaskId')

//   if (activeTaskId && isTaskActive) {
//     localStorage.setItem('curruntTotalTime', seconds)
//   }

//   return <span>{formatTime(seconds)}</span>
// }

// export default TimeConverter

import React, { useState, useEffect, useContext } from 'react'
import formatTime from '../../utils/formatTime'
import calculateDuration from '../../utils/calculateDuration'
import { useDispatch } from 'react-redux'
import { setTimeDuration } from '../../../../Services/Redux/Action/TimeDurationAction'
import ActiveTabContext from '../../Context/ActiveTabContext'

const TimeConverter = ({ initialSeconds, isActive, isTaskActive, isdatatime }) => {
  const { isTimerUpdate, setIsTimeUpdate } = useContext(ActiveTabContext)
  const updatedTaskDate = localStorage.getItem('updatedTaskDate')
  const dispatch = useDispatch()
  const [seconds, setSeconds] = useState(() => {
    const duration = calculateDuration(
      updatedTaskDate ? updatedTaskDate : localStorage.getItem('startedTaskDateForLoop'),
      new Date().toUTCString()
    )
    return duration + initialSeconds
  })

  useEffect(() => {
    let timer

    const updateTime = () => {
      const updatedTaskDate = localStorage.getItem('updatedTaskDate')
      const duration = calculateDuration(
        updatedTaskDate ? updatedTaskDate : localStorage.getItem('startedTaskDateForLoop'),
        new Date().toUTCString()
      )

      localStorage.setItem('LastEndTime', new Date().toUTCString())
      setSeconds(duration + isdatatime)
    }

    if (isActive) {
      updateTime()
      timer = setInterval(updateTime, 1000)
    }

    return () => clearInterval(timer)
  }, [isActive, isdatatime, isTimerUpdate])

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    setIsTimeUpdate(false)
  }, [isTimerUpdate])

  const activeTaskId = localStorage.getItem('activeTaskId')

  if (activeTaskId && isTaskActive) {
    localStorage.setItem('curruntTotalTime', seconds)
  }

  return <span>{formatTime(seconds)}</span>
}

export default TimeConverter
