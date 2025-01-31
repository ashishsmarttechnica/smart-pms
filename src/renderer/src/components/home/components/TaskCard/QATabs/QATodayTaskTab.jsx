import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { json, useNavigate } from 'react-router-dom'
import {
  createTaskTimer,
  updateTaskTimer
} from '../../../../../../../Services/Redux/Action/TaskTimerAction'
import {
  getTaskList,
  updateTaskStatus
} from '../../../../../../../Services/Redux/Action/TaskAction'
import calculateDuration from '../../../../../utils/calculateDuration'
import formatTime from '../../../../../utils/formatTime'
import TaskProgress from '../TaskProgress'
import TaskProgressActive from '../TaskProgressActive'
import TimeConverter from './../../../../common/TimeConverter'
import PlaySvg from './../../../../../svg/PlaySvg'
import PauseSvg from './../../../../../svg/PauseSvg'
import StopSvg from './../../../../../svg/StopSvg'
import VDots from '../../../../../svg/VDots'
// import StopTaskmodal from '../StopTaskmodal'
import { Button, ButtonToolbar, Input, Loader, Modal, Tooltip, Uploader, Whisper } from 'rsuite'
import { MdDescription, MdSend } from 'react-icons/md'
import { createNote } from '../../../../../../../Services/Redux/Action/NotesAction'
import { io } from 'socket.io-client'
import ActiveTabContext from '../../../../../Context/ActiveTabContext'
import SingleTaskDetailModal from '../TaskTabs/SingleTaskDetailModal'
import QATaskProgress from '../QATaskProgress'
import QATaskProgressActive from '../QATaskProgressActive'
import ReOpenModal from '../ReOpenModal'
import { FaArrowRotateRight, FaCheck } from 'react-icons/fa6'
import StopTaskModal from '../StopTaskmodal'

// import { toast } from 'react-toastify'
import { localSocketPort } from './../../../../../../../url'
import ReOpenModalNew from '../ReOpenModalNew'
import { FaBomb, FaImage } from 'react-icons/fa'
import { openLinkInBrowser } from '../../../../../utils/openLinkInBrowser'
import { GrAttachment } from 'react-icons/gr'
import BugSvg from '../../../../../assets/svgs/BugSvg'
import ImprovementSvg from '../../../../../assets/svgs/ImprovementSvg'
import ChangesSvg from '../../../../../assets/svgs/ChangesSvg'
import { ImForward } from 'react-icons/im'

const QATodayTaskTab = ({ isCleanupComplete, setIsCleanupComplete }) => {
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [errors, setErrors] = useState({ files: '', text: '' })
  const { tasks, error, loading } = useSelector((state) => state.taskList)
  const curruntTotalTime = localStorage.getItem('curruntTotalTime')
  const {
    activeTab,
    setActiveTab,
    tabs,
    socketCount,
    pauseCapturingScreenshots,
    trackerWidget,
    stopCapturingScreenshots,
    startStopAFK,
    activeTask,
    setActiveTask
  } = useContext(ActiveTabContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [singleTaskModal, setSingleTaskModal] = useState(false)
  const [reOpenModal, setReOpenModal] = useState(false)
  const [singleTaskData, setSingleTaskData] = useState({})
  const [stopTaskFormData, setStopTaskFormData] = useState({ files: null, text: '' })
  const [stopTaskloading, setStopTaskloading] = useState(false)
  const isFirstRender = useRef(true)
  const [socketStatus, setSocketStatus] = useState(null)
  const dispatch = useDispatch()
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const settingData = useSelector((state) => state.settingDetails)

  const [taskPlayPauseLoader, setTaskPlayPauseLoader] = useState(false)

  // const handlePauseTask = (event, id) => {
  //   event.stopPropagation()
  //   const startedTaskDate = localStorage.getItem('startedTaskDate')
  //   return dispatch(
  //     updateTaskTimer({
  //       user_id: localStorage.getItem('userId'),
  //       task_id: id,
  //       startdate: startedTaskDate,
  //       enddate: new Date().toUTCString(),
  //       duration: calculateDuration(startedTaskDate, new Date().toUTCString())
  //     })
  //   ).then((res) => {
  //     if (res.success) {
  //       localStorage.removeItem('TaskTimerId')
  //       localStorage.removeItem('startedTaskDate')
  //       localStorage.removeItem('startedTaskDateForLoop')
  //       localStorage.removeItem('activeTaskId')
  //       localStorage.removeItem('curruntTotalTime')
  //       localStorage.removeItem('activeProjectId')
  //       setIsCleanupComplete(false)
  //       dispatch(updateTaskStatus(id, 9)).then((res) => {
  //         if (res.success) {
  //           dispatch(getTaskList('7,8,9'))
  //           pauseCapturingScreenshots()
  //           startStopAFK(false)
  //         }
  //       })
  //       setActiveTaskId(null)
  //     }
  //   })
  // }

  const handlePauseTask = async (event, id) => {
    event.stopPropagation()

    const startedTaskDate = localStorage.getItem('startedTaskDate')

    try {
      // Update task timer and wait for the dispatch to finish
      const res = await dispatch(
        updateTaskTimer({
          user_id: localStorage.getItem('userId'),
          task_id: id,
          startdate: startedTaskDate,
          enddate: new Date().toUTCString(),
          duration: calculateDuration(startedTaskDate, new Date().toUTCString())
        })
      )

      // Check if task timer update is successful
      if (res.success) {
        // Clear localStorage
        localStorage.removeItem('TaskTimerId')
        localStorage.removeItem('startedTaskDate')
        localStorage.removeItem('startedTaskDateForLoop')
        localStorage.removeItem('activeTaskId')
        localStorage.removeItem('curruntTotalTime')
        localStorage.removeItem('activeProjectId')
        localStorage.removeItem('updatedTaskDate')

        // Set state to indicate cleanup is complete
        setIsCleanupComplete(false)

        // Update task status and check if it was successful
        const statusUpdateRes = await dispatch(updateTaskStatus(id, 9))
        if (statusUpdateRes.success) {
          // Fetch task list if task status update is successful
          const taskListRes = await dispatch(getTaskList('7,8,9'))
          if (taskListRes.success) {
            pauseCapturingScreenshots()
            // Start/Stop AFK detection
            startStopAFK(false)
            trackerWidget(false)

            // Reset active task
            setActiveTaskId(null)
          } else {
            console.error('Failed to fetch task list')
          }
        } else {
          console.error('Failed to update task status')
        }
      } else {
        console.error('Failed to update task timer')
      }
    } catch (error) {
      console.error('Error pausing task:', error)
    }
  }

  const handleStopTask = (event, id) => {
    event.stopPropagation()
    setStopTaskFormData({ files: null, text: '' })
    setErrors({ files: '', text: '' })
    openModal()
  }
  const handlePlayTask = (event, val) => {
    setActiveTask(val)
    setTaskPlayPauseLoader(true)
    event.stopPropagation()

    localStorage.setItem('activeProjectId', val.project_id._id)
    const previousTaskId = localStorage.getItem('activeTaskId')
    localStorage.setItem('LastEndTime', new Date().toUTCString())
    if (val._id == activeTaskId) {
      localStorage.setItem('curruntTotalTime', val.total_time_spent_by_user)
    }

    if (previousTaskId && previousTaskId !== val._id) {
      handlePauseTask(event, previousTaskId).then(() => {
        startNewTask(val._id, val.project_id._id, val)
      })
    } else {
      startNewTask(val._id, val.project_id._id, val)
    }
  }

  const startNewTask = (id, projectId, singleData) => {
    localStorage.setItem('activeTaskId', id)
    setActiveTaskId(id)

    dispatch(
      createTaskTimer({
        user_id: localStorage.getItem('userId'),
        task_id: id,
        startdate: new Date().toUTCString(),
        enddate: null,
        duration: 0
      })
    ).then((res) => {
      if (res.success) {
        localStorage.setItem('TaskTimerId', res.data._id)
        localStorage.setItem('startedTaskDate', res.data.startdate)
        localStorage.setItem('startedTaskDateForLoop', new Date().toUTCString())
        setIsCleanupComplete(true)
        dispatch(updateTaskStatus(id, 8)).then((res) => {
          if (res.success) {
            dispatch(getTaskList('7,8,9'))
            startCapturingScreenshots(projectId)
            trackerWidget(true, singleData)
            startStopAFK(true)
            setTaskPlayPauseLoader(false)
          }
        })
      }
    })
  }

  const startCapturingScreenshots = async (projectId) => {
    try {
      if (window.electron) {
        await window.electron.invoke('start-capturing-screenshots', {
          userId: localStorage.getItem('userId'),
          projectId: projectId,
          settingData: settingData.data
        })
      } else {
        console.error('Electron API is not available')
      }
    } catch (error) {
      console.error('Error starting screenshot capture:', error)
    }
  }

  const validateStopTaskForm = (data) => {
    const newErrors = {}

    // // Validate files
    // if (!data.files || (Array.isArray(data.files) && data.files.length === 0)) {
    //   newErrors.files = 'Please upload a file.'
    // }

    // Validate text
    if (!data.text.trim()) {
      newErrors.text = 'Please add a description.'
    }

    return newErrors
  }

  // modal hendle
  const handleStopTaskSubmit = (e) => {
    e.preventDefault()

    // Reset errors
    setErrors({ files: '', text: '' })

    const startedTaskDate = localStorage.getItem('startedTaskDate')

    // Validate the form data
    const validationErrors = validateStopTaskForm(stopTaskFormData)

    // Check if there are any errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return // Stop form submission
    }
    // If no errors, proceed with the dispatch actions
    setStopTaskloading(true)
    dispatch(createNote(stopTaskFormData, activeTaskId))
      .then((res) => {
        if (res.success) {
          return dispatch(
            updateTaskTimer({
              user_id: localStorage.getItem('userId'),
              task_id: activeTaskId,
              startdate: startedTaskDate,
              enddate: new Date().toUTCString(),
              duration: calculateDuration(startedTaskDate, new Date().toUTCString())
            })
          ).then((res) => {
            if (res.success) {
              // Clear localStorage
              localStorage.removeItem('TaskTimerId')
              localStorage.removeItem('startedTaskDate')
              localStorage.removeItem('startedTaskDateForLoop')
              localStorage.removeItem('activeTaskId')
              localStorage.removeItem('curruntTotalTime')
              localStorage.removeItem('activeProjectId')
              setIsCleanupComplete(false)
              dispatch(updateTaskStatus(activeTaskId, 10)).then((res) => {
                if (res.success) {
                  dispatch(getTaskList('7,8,9'))
                  stopCapturingScreenshots()
                  closeModal()
                  setStopTaskFormData({ files: null, text: '' })
                  startStopAFK(false)
                  trackerWidget(false)
                }
              })
              setActiveTaskId(null)
            }
          })
        }
      })
      .finally(() => {
        setStopTaskloading(false)
      })
  }

  const handleReOpneModal = (e, singleData) => {
    e.stopPropagation()
    setSingleTaskData(singleData)
    setReOpenModal(true)
  }

  const handleFileChange = (fileList) => {
    setStopTaskFormData((prevState) => ({
      ...prevState,
      files: fileList.length > 0 ? fileList.map((file) => file.blobFile) : []
    }))
  }

  const handleRemoveFile = (file) => {
    // Remove the file from the state
    setStopTaskFormData((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.key !== file.key) // Check if 'key' is the correct property
    }))
  }

  const handleTextChange = (value) => {
    setStopTaskFormData((prevState) => ({
      ...prevState,
      text: value
    }))
  }

  useEffect(() => {
    if (!isCleanupComplete) {
      return
    }
    const storedActiveTaskId = localStorage.getItem('activeTaskId')
    if (storedActiveTaskId) {
      setActiveTaskId(storedActiveTaskId)
    }
  }, [isCleanupComplete])

  useEffect(() => {
    if (isFirstRender.current) {
      // Skip the first render
      isFirstRender.current = false
      return
    }

    // Run the desired function when socketStatus changes

    if (socketStatus) {
      handleSocketTrue()
    } else {
      handleSocketFalse()
    }
  }, [socketStatus])

  const handleSocketTrue = () => {
    const startedTaskDate = localStorage.getItem('startedTaskDateForLoop')
    const updatedTaskDate = localStorage.getItem('updatedTaskDate')
    // const startedTaskDate = localStorage.getItem('startedTaskDate')

    return dispatch(
      updateTaskTimer({
        user_id: localStorage.getItem('userId'),
        task_id: activeTaskId,
        // startdate: startedTaskDate,
        enddate: new Date().toUTCString(),
        duration: calculateDuration(startedTaskDate, new Date().toUTCString())
      })
    ).then((res) => {
      if (res.success) {
        localStorage.removeItem('TaskTimerId')
        localStorage.removeItem('startedTaskDate')
        localStorage.removeItem('startedTaskDateForLoop')
        localStorage.removeItem('curruntTotalTime')
        setIsCleanupComplete(false)

        dispatch(updateTaskStatus(activeTaskId, 9)).then((res) => {
          if (res.success) {
            if (activeTab === 'testerToday') {
              dispatch(getTaskList('7,8,9'))
            } else if (activeTab === 'testerEstimation') {
              dispatch(getTaskList('6'))
            } else {
              dispatch(getTaskList('10'))
            }

            pauseCapturingScreenshots()
            trackerWidget(false)
          }
        })

        setActiveTaskId(null)
      }
    })
  }

  const handleSocketFalse = () => {
    const forSocketActiceTask = localStorage.getItem('activeTaskId')

    dispatch(
      createTaskTimer({
        user_id: localStorage.getItem('userId'),
        task_id: forSocketActiceTask,
        startdate: new Date().toUTCString(),
        enddate: null,
        duration: 0
      })
    ).then((res) => {
      if (res.success) {
        localStorage.setItem('TaskTimerId', res.data._id)
        localStorage.setItem('startedTaskDate', res.data.startdate)
        localStorage.setItem('startedTaskDateForLoop', new Date().toUTCString())

        setIsCleanupComplete(true)
        dispatch(updateTaskStatus(forSocketActiceTask, 8)).then((res) => {
          if (res.success) {
            if (activeTab === 'testerToday') {
              dispatch(getTaskList('7,8,9'))
            } else if (activeTab === 'testerEstimation') {
              dispatch(getTaskList('6'))
            } else {
              dispatch(getTaskList('10'))
            }
            startCapturingScreenshots(localStorage.getItem('activeProjectId'))
            trackerWidget(true)
          }
        })
      }
    })
  }

  const handleSingleDataShow = (singleData) => {
    setSingleTaskData(singleData)
    setSingleTaskModal(true)
  }

  useEffect(() => {
    const socket = io(`http://localhost:${localSocketPort}`) // Update to the correct port
    console.log('Connected to socket')

    socket.on('status', (data) => {
      setSocketStatus(data.afk) // Should log the message from the server
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // useEffect(() => {
  //   if (activeTaskId) {
  //     const activeTaskData = tasks.find((task) => task._id === activeTaskId)
  //     console.log(activeTaskData , "for QA");

  //     setActiveTask(activeTaskData)
  //   }
  // }, [activeTaskId])

  return (
    <>
      <div className="topTabMenuHeader">
        <div>Today</div>
      </div>
      <div className="topTabMenuBodyOverlay cardOverflowStik">
        {loading || taskPlayPauseLoader ? (
          <div className="flex justify-center items-center h-full">
            <Loader speed="fast" size="md" />
          </div>
        ) : (
          tasks.map((val, index) => (
            <div
              key={val._id}
              className="border-b border-borderGray p-2 pb-3  hover:bg-slate-100 transition-all duration-100 cursor-default"
              onClick={() => handleSingleDataShow(val)}
            >
              <div className="flex gap-1 items-end justify-between relative">
                <div className="absolute top-0 flex gap-1 items-center w-[68%]">
                  <div>
                    {val.type === 'Bug' && (
                      <Whisper
                        placement="topStart"
                        trigger="hover"
                        speaker={<Tooltip>Bug</Tooltip>}
                      >
                        <div>
                          <BugSvg />
                        </div>
                      </Whisper>
                    )}
                    {val.type === 'Improvement' && (
                      <Whisper
                        placement="topStart"
                        trigger="hover"
                        speaker={<Tooltip>Improvement</Tooltip>}
                      >
                        <div>
                          <ImprovementSvg />
                        </div>
                      </Whisper>
                    )}
                    {val.type === 'Changes' && (
                      <Whisper
                        placement="topStart"
                        trigger="hover"
                        speaker={<Tooltip>Changes</Tooltip>}
                      >
                        <div>
                          <ChangesSvg />
                        </div>
                      </Whisper>
                    )}
                  </div>
                  <Whisper
                    placement="topStart"
                    trigger="hover"
                    speaker={<Tooltip>Project</Tooltip>}
                  >
                    <div className="rounded-sm  text-white px-2 py-0.5 text-[12px] bg-gray-900 ">
                      {val.project_id?.name}
                    </div>
                  </Whisper>

                  {val?.module_id && (
                    <Whisper
                      placement="topStart"
                      trigger="hover"
                      speaker={<Tooltip>Module</Tooltip>}
                    >
                      <div className="rounded-full  text-white px-2.5 py-0.5 text-[12px] bg-primary">
                        {val?.module_id?.name}
                      </div>
                    </Whisper>
                  )}

                  {val.project_id?.attachment_link !== '' && val.project_id?.attachment_link && (
                    <div className="">
                      <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={<Tooltip>Project Attachment Link</Tooltip>}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            openLinkInBrowser(val.project_id?.attachment_link)
                          }}
                        >
                          <GrAttachment size={17} />
                        </div>
                      </Whisper>
                    </div>
                  )}

                  <div className="ml-auto flex gap-1 items-center">
                    {val?.reopen_count != 0 && (
                      <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={<Tooltip>Reopen Count</Tooltip>}
                      >
                        <div className=" flex items-center gap-1 border  border-red-700 text-red-800 bg-red-800/10 px-2  rounded-full  text-sm">
                          <FaBomb size={15} /> <span>{val?.reopen_count}</span>
                        </div>
                      </Whisper>
                    )}
                    {val.forwarededBy && (
                      <div className=" flex items-center gap-1 bg-gray-600 px-2 text-white rounded-full  text-sm">
                        <ImForward size={15} />{' '}
                        <span>
                          {val.forwarededBy.first_name} {val.forwarededBy.last_name}
                        </span>
                      </div>
                    )}
                    {val.task_description && (
                      <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={<Tooltip>Description</Tooltip>}
                      >
                        <div>
                          <MdDescription size={20} />
                        </div>
                      </Whisper>
                    )}

                    {val.task_img.length > 0 && (
                      <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={
                          <Tooltip>
                            {val.task_img.length} {val.task_img.length === 1 ? 'image ' : 'images '}
                            attached
                          </Tooltip>
                        }
                      >
                        <div>
                          <FaImage size={20} />
                        </div>
                      </Whisper>
                    )}
                  </div>
                </div>
                <div className="w-[680px]  pl-1  flex justify-between items-center ">
                  <div className="text-dark text-base font-medium text-nowrap truncate">
                    {' '}
                    {val.task}
                  </div>
                  <div>
                    <div
                      className={`rounded-full  font-semibold tracking-wider  text-[12px] text-center px-2 py-0.5
                    ${
                      val.status === 7
                        ? ' border border-yellow-700 text-yellow-800 bg-yellow-800/10'
                        : ''
                    }
                    ${
                      val.status === 8
                        ? ' border border-green-700 text-green-800 bg-green-800/10'
                        : ''
                    }
                    ${val.status === 9 ? ' border border-red-700 text-red-800 bg-red-800/10' : ''}
                    `}
                    >
                      {val.status === 7
                        ? 'Pending'
                        : val.status === 8
                        ? 'Running'
                        : val.status === 9
                        ? 'Hold'
                        : ''}
                    </div>
                  </div>
                </div>

                <div className="w-[120px]   ">
                  <div className="text-base text-center font-medium text-black  ">
                    <span className=" font-semibold"> EST :</span> {formatTime(val.testEst_time)}
                  </div>
                  <div className="text-base text-center font-medium text-black  ">
                    <span className=" font-semibold">CRT :</span>{' '}
                    {formatTime(val.testCritical_time)}
                  </div>
                </div>
                {/* time converter */}
                <div className="w-[70px] text-center ">
                  <div className=" ">
                    {/* play/pause svg */}
                    {activeTaskId != val._id ? (
                      <button onClick={(event) => handlePlayTask(event, val)}>
                        <PlaySvg isDark />
                      </button>
                    ) : (
                      <button onClick={(event) => handlePauseTask(event, val._id)}>
                        <PauseSvg isDark />
                      </button>
                    )}
                  </div>

                  {activeTaskId !== val._id ? (
                    <div>{formatTime(val.total_time_spent_by_user)}</div>
                  ) : (
                    <>
                      <TimeConverter
                        initialSeconds={
                          activeTaskId == val._id
                            ? curruntTotalTime
                              ? JSON.parse(curruntTotalTime)
                              : val.total_time_spent_by_user
                            : val.total_time_spent_by_user
                        }
                        isTaskId={val._id}
                        isActive={true}
                        isTaskActive={activeTaskId == val._id}
                        isdatatime={val.total_time_spent_by_user}
                      />
                    </>
                  )}
                </div>

                {/* <div>{formatTime(val.total_time_spent_by_user)}</div> */}

                <div className=" w-[75px] flex justify-center gap-1 my-auto ">
                  <div className="">
                    {activeTaskId == val._id && val.status == 8 ? (
                      <button
                        onClick={(event) => handleStopTask(event, val._id)}
                        className="rounded-full p-1.5 text-white font-medium text-sm bg-green-600 hover:bg-green-700 transition duration-200"
                      >
                        {/* <StopSvg isDark /> */}
                        <FaCheck size={18} />
                      </button>
                    ) : (
                      ''
                    )}
                  </div>

                  {activeTaskId == val._id && val.status == 8 ? (
                    <button
                      className="rounded-full p-1.5 text-white font-medium text-sm bg-red-600 hover:bg-red-700 transition duration-200"
                      onClick={(e) => handleReOpneModal(e, val)}
                    >
                      <FaArrowRotateRight size={18} />
                    </button>
                  ) : (
                    ''
                  )}
                </div>

                <div className="w-[20px] self-center">
                  {/* v dots */}
                  <VDots isDark />
                </div>
              </div>
              {/* <div className="truncate mt-1  ms-1 text-dark/50 ">
                <span className="text-dark font-medium">Description : </span>
                {val?.task_description && val.task_description.split(' ').length > 10
                  ? val.task_description.split(' ').slice(0, 10).join(' ') + '...'
                  : val?.task_description || ''}
              </div> */}

              <div className="mt-3">
                {activeTaskId !== val._id ? (
                  <QATaskProgress val={val} />
                ) : (
                  <QATaskProgressActive val={val} />
                )}
              </div>
            </div>
          ))
        )}
        {/* <StopTaskmodal /> */}
        <StopTaskModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          handleStopTaskSubmit={handleStopTaskSubmit}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          handleTextChange={handleTextChange}
          stopTaskFormData={stopTaskFormData}
          stopTaskloading={stopTaskloading}
          errors={errors}
          activeTaskId={activeTaskId}
        />

        {singleTaskModal && (
          <SingleTaskDetailModal
            singleTaskModal={singleTaskModal}
            setSingleTaskModal={setSingleTaskModal}
            curruntTotalTime={curruntTotalTime}
            data={singleTaskData}
            activeTaskId={activeTaskId}
            isTodayTask={true}
          />
        )}

        <ReOpenModalNew
          reOpenModal={reOpenModal}
          setReOpenModal={setReOpenModal}
          data={singleTaskData}
        />
      </div>
    </>
  )
}

export default QATodayTaskTab
