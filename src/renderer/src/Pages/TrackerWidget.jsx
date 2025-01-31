import React, { useState, useEffect } from 'react'
import TrackerWidgetPlaySvg from '../assets/svgs/TrackerWidgetPlaySvg'
import TrackerWidgetPauseSvg from '../assets/svgs/TrackerWidgetPauseSvg'
import TrackerWidgetDragnDropSvg from '../assets/svgs/TrackerWidgetDragnDropSvg'
import formatTime from '../utils/formatTime'
import calculateDuration from './../utils/calculateDuration'

const TrackerWidget = () => {
  const [count, setCount] = useState(0)
  const [activeTask, setActiveTask] = useState(null)
  const [statusColor, setStatusColor] = useState('green') // Initialize state for status
  const isTest = localStorage.getItem('role') == 'QA'
  // Calculate conditions based on the time thresholds
  const isEstUp = isTest ? activeTask?.testEst_time < count : activeTask?.est_time < count // 0 to est (green)
  const isPmtUp = isTest ? false : activeTask?.pm_time < count // est to pmt (yellow)
  const iscrtUp = isTest ? activeTask?.testCritical_time < count : activeTask?.critical_time < count // pmt to crt (red)

  const updatedTaskDate = localStorage.getItem('updatedTaskDate')
  const currentTotalTime = localStorage.getItem('curruntTotalTime') || 0
  const timerState = localStorage.getItem('activeTaskId')

  useEffect(() => {
    let interval
    if (timerState) {
      // Update the timer every second
      interval = setInterval(() => {
        const duration = calculateDuration(
          updatedTaskDate ? updatedTaskDate : localStorage.getItem('startedTaskDateForLoop'),
          new Date().toUTCString()
        )
        setCount(duration + +currentTotalTime) // Update in state
      }, 1000)
    }

    return () => {
      // Clear the interval when the component unmounts or timerState changes
      clearInterval(interval)
    }
  }, [timerState]) // Rerun this effect when `timerState` changes

  const checkSystemTime = async () => {
    try {
      if (window.electron) {
        // Listen for 'set-active-task' event
        window.electron.receive('set-active-task', (task) => {
          setActiveTask(task) // Set the active task to the state
        })
      } else {
        console.error('Electron API is not available')
      }
    } catch (error) {
      console.error('Error checking system time:', error)
    }
  }

  useEffect(() => {
    checkSystemTime()
  }, [])

  // Update statusColor based on conditions
  useEffect(() => {
    if (!isTest) {
      if (isEstUp && !isPmtUp && !iscrtUp) {
        setStatusColor('yellow') // Time is up for estimated time
      } else if (!isEstUp && isPmtUp && !iscrtUp) {
        setStatusColor('yellow') // Time is up for PM time
      } else if (isEstUp && isPmtUp && !iscrtUp) {
        setStatusColor('red') // Time is up for PM time
      } else if (isEstUp && isPmtUp && iscrtUp) {
        setStatusColor('black') // Time is up for critical time
      }
    } else {
      if (isEstUp) {
        setStatusColor('red')
      } else if (iscrtUp) {
        setStatusColor('black')
      }
    }
  }, [isEstUp, isPmtUp, iscrtUp]) // Re-run this when any of the conditions change

  return (
    <div
      className={`flex h-full w-full py-1.5 flex-row items-center justify-between font-mono rounded-[4px]  border-0 backdrop-blur-md
      ${statusColor === 'green' && 'bg-green-700/70 border-green-500'}
      ${statusColor === 'yellow' && 'bg-yellow-700/70 border-yellow-500'}
      ${statusColor === 'red' && 'bg-red-700/70 border-red-500'}
      ${statusColor === 'black' && 'bg-gray-700/70 border-black'}
    `}
    >
      {/* Drag and Drop Button */}
      <button onClick={() => console.log('drag and drop button clicked')} className="ml-1.5 drag cursor-pointer z-10">
        <TrackerWidgetDragnDropSvg cls="cursor-pointer" />
      </button>
      {/* Play/Pause Button */}
      <button
        className={`m-0 text-white  w-6 h-6 outline-none rounded-full flex items-center justify-center
         ${statusColor === 'green' && 'bg-green-900'}
          ${statusColor === 'yellow' && 'bg-yellow-900'}
          ${statusColor === 'red' && 'bg-red-900'}
          ${statusColor === 'black' && 'bg-gray-900'}`}
      >
        {timerState ? <TrackerWidgetPlaySvg /> : <TrackerWidgetPauseSvg />}
      </button>
      {/* Display Current Total Time */}
      <div className="rounded-full text-white mr-1.5">{formatTime(count)}</div>
    </div>
  )
}

export default TrackerWidget
