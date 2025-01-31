import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTaskFromSocket,
  getTaskList,
  updateTaskStatus
} from '../../../../../../Services/Redux/Action/TaskAction'
import { updateTaskTimer } from '../../../../../../Services/Redux/Action/TaskTimerAction'
import calculateDuration from '../../../../utils/calculateDuration'
import ActiveTabContext from '../../../../Context/ActiveTabContext'
import { io } from 'socket.io-client'
import EstimationTask from './TaskTabs/EstimationTask'
import CompleteTaskTab from './TaskTabs/CompleteTaskTab'
import TodayTaskTab from './TaskTabs/TodayTaskTab'
import { url } from '../../../../../../url'
import QAEstimationTask from './QATabs/QAEstimationTask'
import QATodayTaskTab from './QATabs/QATodayTaskTab'
import QACompleteTaskTab from './QATabs/QACompleteTaskTab'
import { getAdminDetails } from '../../../../../../Services/Redux/Action/AuthAction'

const TaskCard = () => {
  const {
    activeTab,
    setActiveTab,
    tabs,
    testerTabs,
    socketCount,
    pauseCapturingScreenshots,
    startStopAFK,
    trackerWidget,
    socketStatus, // for afkstatus
    setIsTimeUpdate
  } = useContext(ActiveTabContext)
  const [isCleanupComplete, setIsCleanupComplete] = useState(false)
  const dispatch = useDispatch()
  const role = localStorage.getItem('role')
  const settingData = useSelector((state) => state.settingDetails)
  const [isTodayGet, setIsTodayGet] = useState(false)
  // tabs is used to display the tabs of the task
  const handleTabClick = (tab) => {
    setActiveTab(tab.id)
    if (activeTab != tab.id) {
      dispatch(getTaskList(tab.status))
    }
  }

  const activeTaskId = localStorage.getItem('activeTaskId')

  useEffect(() => {
    let timer
    const activeTaskId = localStorage.getItem('activeTaskId')
    if (activeTaskId && localStorage.getItem('curruntTotalTime') != 'NaN') {
      timer = setInterval(() => {
        const currentTime = parseInt(localStorage.getItem('curruntTotalTime'), 10)
        if (activeTab != 'today')
          if (isCleanupComplete) {
            localStorage.setItem('LastEndTime', new Date().toUTCString())
          }
        if (!isNaN(currentTime)) {
          localStorage.setItem('curruntTotalTime', (currentTime + 1).toString())
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [activeTab, isCleanupComplete])

  useEffect(() => {
    // Validate the interval value and set a default fallback
    const intervalTime = settingData?.data?.timelineUpdate
    const safeIntervalTime =
      typeof intervalTime === 'number' && intervalTime > 0 ? intervalTime : 500

    const apiInterval = setInterval(() => {
      const activeTask = localStorage.getItem('activeTaskId')
      if (activeTask && (socketStatus === null || !socketStatus)) {
        dispatch(
          updateTaskTimer({
            user_id: localStorage.getItem('userId'),
            task_id: localStorage.getItem('activeTaskId'),
            startdate: localStorage.getItem('startedTaskDateForLoop'),
            enddate: new Date().toUTCString(),
            duration: calculateDuration(
              localStorage.getItem('startedTaskDateForLoop'),
              new Date().toUTCString()
            )
          })
        )
          .then((res) => {
            if (res.success) {
              localStorage.removeItem('curruntTotalTime')
              localStorage.setItem('updatedTaskDate', new Date().toUTCString())
              setIsTimeUpdate(true)
              setIsTodayGet(true)
            } else {
              console.error('API call failed.')
            }
          })
          .catch((err) => console.error('API call error:', err))
      }
    }, 1000 * safeIntervalTime)

    return () => clearInterval(apiInterval) // Cleanup on unmount
  }, [activeTaskId, socketStatus])

  useEffect(() => {
    if (isTodayGet) {
      if (activeTab === 'today' || activeTab === 'testerToday') {
        dispatch(getTaskList(role != 'QA' ? '2,3,4' : '7,8,9'))
      }

      setIsTodayGet(false)
    }
  }, [isTodayGet, activeTab])

  // useEffect is used to update the task timer when the active task id is changed
  useEffect(() => {
    let auth = localStorage.getItem('token')

    if (activeTaskId) {
      dispatch(getAdminDetails(auth)).then((res) => {
        if (res.success) {
          dispatch(
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
              dispatch(
                updateTaskStatus(localStorage.getItem('activeTaskId'), role != 'QA' ? 4 : 9)
              ).then((res) => {
                if (res.success) {
                  localStorage.removeItem('TaskTimerId')
                  localStorage.removeItem('startedTaskDate')
                  localStorage.removeItem('startedTaskDateForLoop')
                  localStorage.removeItem('activeTaskId')
                  localStorage.removeItem('curruntTotalTime')
                  localStorage.removeItem('updatedTaskDate')
                  localStorage.removeItem('activeProjectId')
                  dispatch(getTaskList(role != 'QA' ? '2,3,4' : '7,8,9'))
                  setIsCleanupComplete(true)
                  pauseCapturingScreenshots()
                  trackerWidget(false)
                  startStopAFK(false)
                }
              })
            }
          })
        }
      })
    }
  }, [])

  // useEffect is used to get the task list from the server
  useEffect(() => {
    if (role != 'QA') {
      dispatch(getTaskList('2,3,4'))
    } else {
      dispatch(getTaskList('7,8,9'))
    }
  }, [dispatch])

  // setRole
  useEffect(() => {
    if (role != 'QA') {
      setActiveTab('today')
    } else {
      setActiveTab('testerToday')
    }
  }, [])

  return (
    <div>
      {/* tabs */}
      <div className="flex items-center gap-4 py-4">
        {role != 'QA'
          ? tabs.map((tab) => (
              <div key={tab.id}>
                {tab.id == 'estimation' && socketCount.taskCount > 0 ? (
                  <div className="relative">
                    <button
                      className={`px-4 py-2  border capitalize  rounded-[6px] ${
                        activeTab === tab.id
                          ? 'border-darkBlue bg-darkBlue text-white'
                          : 'border-stone-600 bg-white text-black'
                      }`}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab.label}
                    </button>
                    <div className="absolute -top-2 -right-2  flex justify-center items-center leading-none ">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                      <span className="relative  rounded-full w-6 h-6 bg-danger text-white font-semibold text-[11px]  flex justify-center items-center">
                        {socketCount.taskCount}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    className={`px-4 py-2  border capitalize  rounded-[6px] ${
                      activeTab === tab.id
                        ? 'border-darkBlue bg-darkBlue   text-white'
                        : 'border-stone-600 bg-white text-black'
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab.label}
                  </button>
                )}
              </div>
            ))
          : testerTabs.map((tab) => (
              <div key={tab.id}>
                {tab.id == 'testerEstimation' && socketCount.testerCount > 0 ? (
                  <div className="relative">
                    <button
                      className={`px-4 py-2  border  rounded-[6px] ${
                        activeTab === tab.id
                          ? 'border-darkBlue bg-darkBlue text-white'
                          : 'border-stone-600 bg-white text-black'
                      }`}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab.label}
                    </button>
                    <div className="absolute -top-2 -right-2  flex justify-center items-center leading-none ">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                      <span className="relative  rounded-full w-6 h-6 bg-danger text-white font-semibold text-[11px]  flex justify-center items-center">
                        {socketCount.testerCount}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    className={`px-4 py-2  border  rounded-[6px] ${
                      activeTab === tab.id
                        ? 'border-darkBlue bg-darkBlue text-white'
                        : 'border-stone-600 bg-white text-black'
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab.label}
                  </button>
                )}
              </div>
            ))}
      </div>

      {/* task list */}
      {role != 'QA' ? (
        <div>
          {/* today task */}
          <div className={`${activeTab === 'today' ? 'block' : 'hidden'}`}>
            <TodayTaskTab
              isCleanupComplete={isCleanupComplete}
              setIsCleanupComplete={setIsCleanupComplete}
            />

            {/* {activeTab === 'estimation' && <EstimationTask />} */}
          </div>

          {/* estimation task */}
          {activeTab === 'estimation' && <EstimationTask />}
          {/* complete task */}
          {activeTab === 'complete' && <CompleteTaskTab />}
        </div>
      ) : (
        <div>
          {/* today task */}
          <div className={`${activeTab === 'testerToday' ? 'block' : 'hidden'}`}>
            <QATodayTaskTab
              isCleanupComplete={isCleanupComplete}
              setIsCleanupComplete={setIsCleanupComplete}
            />
          </div>
          {/* estimation task */}
          {activeTab === 'testerEstimation' && <QAEstimationTask />}
          {/* complete task */}
          {activeTab === 'testerComplete' && <QACompleteTaskTab />}
        </div>
      )}
    </div>
  )
}

export default TaskCard
