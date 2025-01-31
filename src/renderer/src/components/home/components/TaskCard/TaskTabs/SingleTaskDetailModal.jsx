import React, { useEffect, useState } from 'react'
import { Loader, Modal, Tooltip, Whisper } from 'rsuite'
import { useDispatch, useSelector } from 'react-redux'
import { getSingleTaskList } from '../../../../../../../Services/Redux/Action/TaskAction'
import formatTime, { formatTimeByHHMM } from '../../../../../utils/formatTime'
import { url } from '../../../../../../../url'
import 'react-image-gallery/styles/css/image-gallery.css'
import ImageGallery from 'react-image-gallery'
import {
  CustomNextButton,
  CustomPrevButton,
  Fullscreen,
  PlayPause,
  renderCustomImage
} from '../TaskDetailComponents/TaskDetailComponents'
import { MdContentCopy } from 'react-icons/md'

const SingleTaskDetailModal = ({
  singleTaskModal,
  setSingleTaskModal,
  curruntTotalTime,
  data,
  activeTaskId,
  isEstimation,
  iscomplete,
  isTodayTask
}) => {
  const dispatch = useDispatch()

  const { loading, singleTask } = useSelector((state) => state.singleTaskData)
  const [isFullscreen, setIsFullscreen] = useState(false) // State to track fullscreen mode
  const [copied, setCopied] = useState(false)

  // Fetch task details when modal is opened
  useEffect(() => {
    if (singleTaskModal) {
      dispatch(getSingleTaskList(data._id))
    }
  }, [singleTaskModal, dispatch, data._id])

  // Extract task and subtasks data
  const task = singleTask && singleTask.length > 0 ? singleTask[0] : null
  const subtasks = singleTask && singleTask.length > 1 ? singleTask.slice(1) : []

  // Prepare images for the gallery
  const images = task?.task_img?.map((img) => ({
    original: `${url}/${img}`,
    thumbnail: `${url}/${img}`,
    description: 'Image' // Optional description
  }))

  const SubTaskimages = []
  // Iterating through subtasks
  subtasks.forEach((subtask) => {
    if (subtask.task_img && Array.isArray(subtask.task_img)) {
      subtask.task_img.forEach((img) => {
        SubTaskimages.push({
          original: `${url}/${img}`,
          thumbnail: `${url}/${img}`,
          description: `Image for ${subtask.name || 'Subtask'}` // Dynamic description
        })
      })
    }
  })

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
  }

  return (
    <Modal
      open={singleTaskModal}
      onClose={() => setSingleTaskModal(false)}
      size="lg"
      backdrop="static"
      className="custom-modal relative"
    >
      <Modal.Header>
        <Modal.Title className="text-base !font-semibold">Task Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-2">
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader size="lg" />
          </div>
        ) : task ? (
          <>
            <div className="flex gap-2">
              {/* Main Task Card */}
              <div
                className={`space-y-2 ${
                  task?.task_img.length > 0 ? 'w-[60%]' : 'w-[100%]'
                }   h-auto`}
              >
                <div className="border bg-lightBlue rounded-md p-2 shadow-sm h-full">
                  <div className="flex justify-between">
                    <div className="flex w-full justify-between gap-1 capitalize text-base">
                      <div className="text-black font-semibold text-lg group transition-all duration-300 inline">
                        {task.task}
                        <Whisper
                          placement="top"
                          trigger="hover"
                          speaker={<Tooltip>Copy Task</Tooltip>}
                        >
                          <button
                            onClick={() => handleCopyText(task.task)}
                            className="ml-1.5 text-sm  opacity-0 invisible inline group-hover:opacity-100 group-hover:visible transition-all duration-300 cursor-pointer"
                          >
                            <MdContentCopy />
                          </button>
                        </Whisper>
                      </div>
                    </div>

                    {/* Total Time Tooltip */}
                    <div className="min-w-fit h-fit px-2 rounded-sm border text-white text-[14px] bg-darkBlue border-darktext-darkBlue/50 cursor-pointer">
                      <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={<Tooltip>Total Time</Tooltip>}
                      >
                        {formatTimeByHHMM(task.totalTimeTaken)}
                      </Whisper>
                    </div>
                  </div>

                  {/* Task Description */}
                  {task.task_description && (
                    <div className="py-1 mt-1 custom-html-content cardOverflowStik max-h-[240px] bg-white overflow-y-auto px-2.5 border rounded-sm">
                      <div dangerouslySetInnerHTML={{ __html: task.task_description }} />
                    </div>
                  )}

                  {/* Time and Priority Information */}
                  <div className="flex flex-wrap  gap-x-5 gap-y-2 pt-2 mt-2 border-t">
                    <div className="flex gap-2 capitalize text-sm">
                      <div className="font-semibold text-black">Project Manager:</div>
                      <div>
                        {task?.pm_id?.first_name} {task?.pm_id?.last_name} {task?.pm_id?.surname}{' '}
                      </div>
                    </div>
                    <div className="flex gap-2 capitalize text-sm">
                      <div className="font-semibold text-black">EST Time:</div>
                      <div>{formatTime(task.est_time)}</div>
                    </div>
                    <div className="flex gap-2 capitalize text-sm">
                      <div className="font-semibold text-black">PM Time:</div>
                      <div>{formatTime(task.pm_time)}</div>
                    </div>
                    <div className="flex gap-2 capitalize text-sm">
                      <div className="font-semibold text-black">Due Date:</div>
                      <div>{new Date(task.due_date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2 capitalize text-sm">
                      <div className="font-semibold text-black">Priority:</div>
                      <div>{task.priority}</div>
                    </div>
                  </div>

                  {/* Assigned Users */}
                  <div className="flex space-x-4 pt-2 mt-2 border-t">
                    {task.total_assigns.map((val) => {
                      const userRole = val.role !== 'QA' ? 'User' : 'Tester'
                      return (
                        <div key={val._id} className="flex gap-2 capitalize text-sm items-center">
                          <div className="font-semibold text-black">{userRole}:</div>
                          <div className="text-black">
                            <div className="flex items-center gap-2 group">
                              <div>
                                {val.first_name} {val.last_name}
                              </div>
                              <div className="px-2 rounded-sm border text-darkGreen text-[14px] bg-lightGreen border-darkGreen/50 cursor-pointer">
                                <Whisper
                                  placement="top"
                                  trigger="hover"
                                  speaker={<Tooltip>{userRole} Total Time</Tooltip>}
                                >
                                  <div>{formatTimeByHHMM(val.totalTime)}</div>
                                </Whisper>
                              </div>
                              <Whisper
                                placement="top"
                                trigger="hover"
                                speaker={<Tooltip> Copy {userRole} Total Time</Tooltip>}
                              >
                                <button
                                  onClick={() => handleCopyText(formatTimeByHHMM(val.totalTime))}
                                  className="opacity-0 text-base invisible inline group-hover:opacity-100 group-hover:visible transition-all duration-300 cursor-pointer"
                                >
                                  <MdContentCopy />
                                </button>
                              </Whisper>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              {task?.task_img.length > 0 && (
                <div className="w-[40%]">
                  <div className="border bg-lightBlue rounded-md p-2 shadow-sm h-full custoHoverdBoc">
                    <ImageGallery
                      items={images}
                      renderItem={renderCustomImage}
                      showThumbnails={false} // Hides thumbnails for a cleaner full-screen experience
                      renderLeftNav={(onClick, disabled) => <CustomPrevButton onClick={onClick} />}
                      renderRightNav={(onClick, disabled) => <CustomNextButton onClick={onClick} />}
                      renderFullscreenButton={(onClick, isFullscreen) => (
                        <Fullscreen
                          onClick={onClick}
                          isFullscreen={isFullscreen}
                          setIsFullscreen={setIsFullscreen}
                        />
                      )}
                      renderPlayPauseButton={(onClick, isPlaying) => (
                        <PlayPause onClick={onClick} isPlaying={isPlaying} />
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Subtasks Section */}
            {subtasks.length > 0 &&
              subtasks.map((subtask, ind) => (
                <div className="flex gap-2 mt-2 pl-3" key={subtask._id}>
                  <div
                    className={`space-y-2  ${
                      subtask.task_img.length > 0 ? 'w-[60%]' : 'w-[100%]'
                    }   h-auto`}
                  >
                    <div className="border bg-lightOrange rounded-md p-2 shadow-sm h-full">
                      <div className="flex justify-between">
                        <div className="flex w-full justify-between gap-1 capitalize text-base">
                          {/* <div className="text-black font-semibold text-lg">{subtask.task}</div> */}
                          <div className="text-black font-semibold text-lg group transition-all duration-300 inline">
                            {subtask.task}
                            <Whisper
                              placement="top"
                              trigger="hover"
                              speaker={<Tooltip>Copy Subtask</Tooltip>}
                            >
                              <button
                                onClick={() => handleCopyText(subtask.task)}
                                className="ml-1.5 text-sm opacity-0 invisible inline group-hover:opacity-100 group-hover:visible transition-all duration-300 cursor-pointer"
                              >
                                <MdContentCopy />
                              </button>
                            </Whisper>
                          </div>
                        </div>

                        {/* Subtask Time Tooltip */}
                        <div className="min-w-fit h-fit px-2 rounded-sm border text-white text-[14px] bg-darkBlue border-darktext-darkBlue/50 cursor-pointer">
                          <Whisper
                            placement="top"
                            trigger="hover"
                            speaker={<Tooltip>Total Time</Tooltip>}
                          >
                            {formatTimeByHHMM(subtask.totalTimeTaken)}
                          </Whisper>
                        </div>
                      </div>

                      {/* Subtask Description */}
                      {subtask.task_description && (
                        <div className="py-1 mt-1 custom-html-content cardOverflowStik max-h-[240px] bg-white  overflow-y-auto px-2.5 border rounded-sm">
                          <div dangerouslySetInnerHTML={{ __html: subtask.task_description }} />
                        </div>
                      )}

                      {/* Subtask Time and Priority Information */}
                      <div className="flex flex-wrap  gap-x-6 gap-y-2 pt-2 mt-2 border-t">
                        <div className="flex gap-2 capitalize text-sm">
                          <div className="font-semibold text-black">EST Time:</div>
                          <div>{formatTime(subtask.est_time)}</div>
                        </div>
                        <div className="flex gap-2 capitalize text-sm">
                          <div className="font-semibold text-black">PM Time:</div>
                          <div>{formatTime(subtask.pm_time)}</div>
                        </div>
                        <div className="flex gap-2 capitalize text-sm">
                          <div className="font-semibold text-black">Due Date:</div>
                          <div>{new Date(subtask.due_date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex gap-2 capitalize text-sm">
                          <div className="font-semibold text-black">Priority:</div>
                          <div>{subtask.priority}</div>
                        </div>
                      </div>

                      {/* Subtask Assigned Users */}
                      <div className="flex space-x-4 pt-2 mt-2 border-t">
                        {subtask.total_assigns.map((val) => {
                          const userRole = val.role !== 'QA' ? 'User' : 'Tester'
                          return (
                            <div
                              key={val._id}
                              className="flex gap-2 capitalize text-sm items-center"
                            >
                              <div className="font-semibold text-black">{userRole}:</div>
                              <div className="text-black">
                                <div className="flex items-center gap-2 group">
                                  <div>
                                    {val.first_name} {val.last_name}
                                  </div>
                                  <div className="px-2 rounded-sm border text-darkGreen text-[14px] bg-lightGreen border-darkGreen/50 cursor-pointer">
                                    <Whisper
                                      placement="top"
                                      trigger="hover"
                                      speaker={<Tooltip>{userRole} Total Time</Tooltip>}
                                    >
                                      <div>{formatTimeByHHMM(val.totalTime)}</div>
                                    </Whisper>
                                  </div>
                                  <Whisper
                                    placement="top"
                                    trigger="hover"
                                    speaker={<Tooltip> Copy {userRole} Total Time</Tooltip>}
                                  >
                                    <button
                                      onClick={() =>
                                        handleCopyText(formatTimeByHHMM(val.totalTime))
                                      }
                                      className="opacity-0 text-base invisible inline group-hover:opacity-100 group-hover:visible transition-all duration-300 cursor-pointer"
                                    >
                                      <MdContentCopy />
                                    </button>
                                  </Whisper>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {subtask.task_img.length > 0 && (
                    <div className="w-[40%]">
                      <div className="border bg-lightOrange rounded-md p-2 shadow-sm h-full custoHoverdBoc">
                        <ImageGallery
                          items={SubTaskimages}
                          renderItem={renderCustomImage}
                          showThumbnails={false} // Hides thumbnails for a cleaner full-screen experience
                          renderLeftNav={(onClick, disabled) => (
                            <CustomPrevButton onClick={onClick} />
                          )}
                          renderRightNav={(onClick, disabled) => (
                            <CustomNextButton onClick={onClick} />
                          )}
                          renderFullscreenButton={(onClick, isFullscreen) => (
                            <Fullscreen
                              onClick={onClick}
                              isFullscreen={isFullscreen}
                              setIsFullscreen={setIsFullscreen}
                            />
                          )}
                          renderPlayPauseButton={(onClick, isPlaying) => (
                            <PlayPause onClick={onClick} isPlaying={isPlaying} />
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </>
        ) : (
          <div>No Task Found</div>
        )}
      </Modal.Body>
      {copied && (
        <span className="text-[13px] bg-green-50 border border-green-600 rounded-sm  px-2  text-green-600 tracking-widest font-semibold absolute bottom-1.5 right-1.5">
          Copied Successfully !
        </span>
      )}
    </Modal>
  )
}

export default SingleTaskDetailModal
