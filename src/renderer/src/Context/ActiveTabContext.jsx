import React, { createContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTaskList } from '../../../Services/Redux/Action/TaskAction'

const ActiveTabContext = createContext()

export function ActiveTabContextProvider({ children }) {
  const settingData = useSelector((state) => state.settingDetails)
  const dispatch = useDispatch()
  const tabs = [
    { id: 'today', label: 'Todays Task', status: '2,3,4' },
    { id: 'estimation', label: 'Estimation Task', status: '0,1' },
    { id: 'complete', label: 'Complete Task', status: '5' }
  ]

  const testerTabs = [
    { id: 'testerToday', label: 'Todays Task', status: '7,8,9' },
    { id: 'testerEstimation', label: 'Estimation Task', status: '6' },
    { id: 'testerComplete', label: 'Complete Task', status: '10' }
  ]
  const [socketStatus, setSocketStatus] = useState(null)
  const [isTimerUpdate, setIsTimeUpdate] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const [permissions, setPermissions] = useState([])
  const [activeTask, setActiveTask] = useState(null)

  const [socketCount, setSocketCount] = useState({
    taskCount: 0,
    pendingMeetingCount: 0,
    approvedMeetingCount: 0,
    message: ''
  })

  const pauseCapturingScreenshots = async () => {
    try {
      if (window.electron) {
        await window.electron.invoke('pause-capturing-screenshots')
      } else {
        console.error('Electron API is not available')
      }
    } catch (error) {
      console.error('Error stopping screenshot capture:', error)
    }
  }
  const stopCapturingScreenshots = async () => {
    try {
      if (window.electron) {
        await window.electron.invoke('stop-capturing-screenshots')
      } else {
        console.error('Electron API is not available')
      }
    } catch (error) {
      console.error('Error stopping screenshot capture:', error)
    }
  }

  const startStopAFK = async (status) => {
    try {
      if (window.electron) {
        await window.electron.invoke('afk-on-off', {
          status: status,
          AfkTime: settingData.data.AFK_time
        })
      } else {
        console.error('Electron API is not available')
      }
    } catch (error) {
      console.error('Error starting screenshot capture:', error)
    }
  }

  const trackerWidget = async (status, singleData) => {
    try {
      if (window.electron) {
        await window.electron.invoke('tracker-widget', {
          status: status,
          activeTask: singleData
        })
      } else {
        console.error('Electron API is not available')
      }
    } catch (error) {
      console.error('Error starting screenshot capture:', error)
    }
  }

  // Notification Click Listener
  useEffect(() => {
    if (!socketStatus && socketStatus !== null) {
      try {
        if (window.electron) {
          // Listen for 'notification-clicked' event
          window.electron.receive('notification-clicked', (payload) => {
            try {
              if (payload.data.role != 'QA') {
                if (payload.IsESTTab == true) {
                  dispatch(getTaskList('0,1'))
                  setActiveTab('estimation')
                } else {
                  dispatch(getTaskList('2,3,4'))
                  setActiveTab('today')
                }
              } else {
                if (payload.IsESTTab == true) {
                  dispatch(getTaskList('6'))
                  setActiveTab('testerEstimation')
                } else {
                  dispatch(getTaskList('7,8,9'))
                  setActiveTab('testerToday')
                }
              }
            } catch (innerError) {
              console.error('Error handling notification payload:', innerError)
            }
          })
        } else {
          console.error('Electron API is not available')
        }
      } catch (error) {
        console.error('Error setting up notification listener:', error)
      }

      // Cleanup listener on unmount
      return () => {
        try {
          if (window.electron) {
            window.electron.removeAllListeners('notification-clicked')
          }
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError)
        }
      }
    }
  }, [])

  return (
    <>
      <ActiveTabContext.Provider
        value={{
          activeTab,
          setActiveTab,
          tabs,
          testerTabs,
          socketCount,
          setSocketCount,
          pauseCapturingScreenshots,
          stopCapturingScreenshots,
          startStopAFK,
          socketStatus,
          setSocketStatus,
          isTimerUpdate,
          setIsTimeUpdate,
          permissions,
          setPermissions,
          trackerWidget,
          activeTask,
          setActiveTask
        }}
      >
        {children}
      </ActiveTabContext.Provider>
    </>
  )
}

export default ActiveTabContext
