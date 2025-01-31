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
import { MdDescription, MdSend, MdSpeakerNotes } from 'react-icons/md'
import { createNote } from '../../../../../../../Services/Redux/Action/NotesAction'
import { io } from 'socket.io-client'
import ActiveTabContext from '../../../../../Context/ActiveTabContext'
import SingleTaskDetailModal from './SingleTaskDetailModal'
import { FaBomb, FaCheck, FaImage } from 'react-icons/fa'
import StopTaskModal from '../StopTaskmodal'
import { localSocketPort } from '../../../../../../../url'
import { GrAttachment } from 'react-icons/gr'
import { openLinkInBrowser } from '../../../../../utils/openLinkInBrowser'
import { RiSearch2Line } from 'react-icons/ri'
import ForwardUser from '../../ForwardUser'
import ProjectFilter from '../ProjectFilter'
import BugSvg from '../../../../../assets/svgs/BugSvg'
import ImprovementSvg from '../../../../../assets/svgs/ImprovementSvg'
import ChangesSvg from '../../../../../assets/svgs/ChangesSvg'
import { CgNotes } from 'react-icons/cg'
import { ImForward } from 'react-icons/im'
import { checkSystemTime } from '../../../../../utils/checkSystemTime'
// import { toast } from 'react-toastify'

const TodayTaskTab = ({ isCleanupComplete, setIsCleanupComplete }) => {
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
    socketStatus,
    setSocketStatus,
    activeTask,
    setActiveTask
  } = useContext(ActiveTabContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [singleTaskModal, setSingleTaskModal] = useState(false)
  const [singleTaskData, setSingleTaskData] = useState({})
  const [stopTaskFormData, setStopTaskFormData] = useState({
    files: null,
    text: ''
  })
  const [stopTaskloading, setStopTaskloading] = useState(false)
  const isFirstRender = useRef(true)
  // const [socketStatus, setSocketStatus] = useState(null)
  const dispatch = useDispatch()
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const settingData = useSelector((state) => state.settingDetails)

  const [taskPlayPauseLoader, setTaskPlayPauseLoader] = useState(false)
  const [filteredTasks, setFilteredTasks] = useState(tasks) // State for filtered tasks
  const [selectedProject, setSelectedProject] = useState('') // State to store selected filter value

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
        const statusUpdateRes = await dispatch(updateTaskStatus(id, 4))
        if (statusUpdateRes.success) {
          // Fetch task list if task status update is successful
          const taskListRes = await dispatch(getTaskList('2,3,4'))
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
        dispatch(updateTaskStatus(id, 3)).then((res) => {
          if (res.success) {
            dispatch(getTaskList('2,3,4'))
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

  const fetchSystemTime = async () => {
    const glTime = await checkSystemTime()
    return new Date(glTime.ntpTime)
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
    dispatch(createNote(stopTaskFormData, activeTaskId)).then((res) => {
      if (res.success) {
        dispatch(
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
            localStorage.removeItem('updatedTaskDate')

            dispatch(updateTaskStatus(activeTaskId, 5)).then((res) => {
              if (res.success) {
                dispatch(getTaskList('2,3,4')).then((res) => {
                  if (res.success) {
                    stopCapturingScreenshots()
                    setStopTaskFormData({ files: null, text: '' })
                    startStopAFK(false)
                    closeModal()
                    setIsCleanupComplete(false)
                    setStopTaskloading(false)
                    trackerWidget(false)
                  } else if (res.data.length === 0) {
                    stopCapturingScreenshots()
                    setStopTaskFormData({ files: null, text: '' })
                    startStopAFK(false)
                    closeModal()
                    setIsCleanupComplete(false)
                    setStopTaskloading(false)
                    trackerWidget(false)
                  }
                })
              }
            })
            setActiveTaskId(null)
          }
        })
      }
    })
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

    return dispatch(
      updateTaskTimer({
        user_id: localStorage.getItem('userId'),
        task_id: activeTaskId,
        // startdate: updatedTaskDate ? updatedTaskDate : startedTaskDate,
        enddate: new Date().toUTCString(),
        // duration: calculateDuration(
        //   updatedTaskDate ? updatedTaskDate : startedTaskDate,
        //   new Date().toUTCString()
        // )
        duration: calculateDuration(startedTaskDate, new Date().toUTCString())
      })
    ).then((res) => {
      if (res.success) {
        localStorage.removeItem('TaskTimerId')
        localStorage.removeItem('updatedTaskDate')
        localStorage.removeItem('startedTaskDate')
        localStorage.removeItem('startedTaskDateForLoop')
        localStorage.removeItem('curruntTotalTime')
        setIsCleanupComplete(false)

        dispatch(updateTaskStatus(activeTaskId, 4)).then((res) => {
          if (res.success) {
            if (activeTab === 'today') {
              dispatch(getTaskList('2,3,4'))
            } else if (activeTab === 'estimation') {
              dispatch(getTaskList('0, 1'))
            } else {
              dispatch(getTaskList('5'))
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
        dispatch(updateTaskStatus(forSocketActiceTask, 3)).then((res) => {
          if (res.success) {
            if (activeTab === 'today') {
              dispatch(getTaskList('2,3,4'))
            } else if (activeTab === 'estimation') {
              dispatch(getTaskList('0, 1'))
            } else {
              dispatch(getTaskList('5'))
            }
            startCapturingScreenshots(localStorage.getItem('activeProjectId'))
            trackerWidget(true, activeTask)
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

  useEffect(() => {
    setTaskPlayPauseLoader(true)
    setTimeout(() => {
      setTaskPlayPauseLoader(false)
    }, 500)
  }, [activeTab])

  useEffect(() => {
    if (selectedProject) {
      const filtered = tasks.filter(
        (task) => task.project_id._id === selectedProject._id || activeTaskId === task._id
      )

      setFilteredTasks(filtered)
    } else {
      setFilteredTasks(tasks)
    }
  }, [selectedProject, tasks])

  // useEffect(() => {
  //   if (activeTaskId) {
  //     setActiveTask(activeTaskData)
  //     const activeTaskData = tasks.find((task) => task._id === activeTaskId)
  //   }
  // }, [activeTaskId])

  return (
    <>
      <div className="topTabMenuHeader flex justify-between">
        <div>Today</div>
        <ProjectFilter selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
      </div>
      <div className="topTabMenuBodyOverlay cardOverflowStik">
        {loading || taskPlayPauseLoader ? (
          <div className="flex justify-center items-center h-full">
            <Loader speed="fast" size="md" />
          </div>
        ) : filteredTasks.length !== 0 ? (
          filteredTasks.map((val, index) => {
            return (
              <div
                key={val._id}
                className="border-b border-borderGray p-2 pb-3  hover:bg-slate-100 transition-all duration-100 cursor-default"
                onClick={() => handleSingleDataShow(val)}
              >
                <div className="flex gap-1 items-end justify-between relative ">
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
                              {val.task_img.length}{' '}
                              {val.task_img.length === 1 ? 'image ' : 'images '}
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
                        className={`rounded-full  font-semibold tracking-wider ml-auto  text-[12px] text-center px-2
                    ${
                      val.status === 2
                        ? ' border border-yellow-700 text-yellow-800 bg-yellow-800/10'
                        : ''
                    }
                    ${
                      val.status === 3
                        ? ' border border-green-700 text-green-800 bg-green-800/10'
                        : ''
                    }
                    ${val.status === 4 ? ' border border-red-700 text-red-800 bg-red-800/10' : ''}
                    `}
                      >
                        {val.status === 2
                          ? 'Pending'
                          : val.status === 3
                          ? 'Running'
                          : val.status === 4
                          ? 'Hold'
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className="w-[120px]   ">
                    <div className="text-base text-center font-medium text-black  ">
                      <span className=" font-semibold">EST : </span>
                      {formatTime(val.est_time)}
                    </div>
                    <div className="text-base text-center font-medium text-black  ">
                      <span className=" font-semibold">PMT : </span>
                      {formatTime(val.pm_time)}
                    </div>
                    {/* <div className="text-base font-medium text-black  text-left">
                    Critical Time : {formatTime(val.critical_time)}
                  </div> */}
                  </div>
                  {/* time converter */}
                  <div className="w-[70px] text-center ">
                    <div>
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

                  <div className=" w-[75px] flex justify-center gap-1 my-auto ">
                    <div>
                      {activeTaskId == val._id && val.status == 3 ? (
                        <button
                          onClick={(event) => handleStopTask(event, val._id)}
                          className="rounded-full p-1.5 text-white font-medium text-sm bg-green-600 hover:bg-green-700 transition duration-200"
                        >
                          <FaCheck size={18} />
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                    <ForwardUser
                      singleData={val}
                      islast={tasks.length - 1 == index && tasks.length > 3}
                    />
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
                    <TaskProgress val={val} />
                  ) : (
                    <TaskProgressActive val={val} />
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-dark/50">No tasks found</div>{' '}
          </div>
        )}
        {/* AFK Is Now {socketStatus ? 'true' : 'false'} */}
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

        <SingleTaskDetailModal
          singleTaskModal={singleTaskModal}
          setSingleTaskModal={setSingleTaskModal}
          curruntTotalTime={curruntTotalTime}
          data={singleTaskData}
          activeTaskId={activeTaskId}
          isTodayTask={true}
        />
      </div>
    </>
  )
}

export default TodayTaskTab
