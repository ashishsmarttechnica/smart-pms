import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VDots from '../../../../../svg/VDots'
import formatTime from '../../../../../utils/formatTime'
import SingleTaskDetailModal from '../TaskTabs/SingleTaskDetailModal'
import EstimationTimeModal from '../EstimationTimeModal'
import QAEstimationTimeModal from './QAEstimationTimeModal'
import { MdDescription, MdOutlineDateRange } from 'react-icons/md'
import { Loader, Tooltip, Whisper } from 'rsuite'
import { FaBomb, FaImage } from 'react-icons/fa'
import { openLinkInBrowser } from '../../../../../utils/openLinkInBrowser'
import { GrAttachment } from 'react-icons/gr'
import ProjectFilter from '../ProjectFilter'
import BugSvg from '../../../../../assets/svgs/BugSvg'
import ImprovementSvg from '../../../../../assets/svgs/ImprovementSvg'
import ChangesSvg from '../../../../../assets/svgs/ChangesSvg'
import { ImForward } from 'react-icons/im'

const QAEstimationTask = () => {
  const [isEstimationModalOpen, setIsEstimationModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [singleTaskModal, setSingleTaskModal] = useState(false)
  const [singleTaskData, setSingleTaskData] = useState({})
  const { tasks, error, loading } = useSelector((state) => state.taskList)
  const dispatch = useDispatch()
  const [filteredTasks, setFilteredTasks] = useState(tasks) // State for filtered tasks
  const [selectedProject, setSelectedProject] = useState('') // State to store selected filter value

  const openEstimationModal = (event, task) => {
    event.stopPropagation()
    setSelectedTask(task)
    setIsEstimationModalOpen(true)
  }

  const handleSingleDataShow = (singleData) => {
    setSingleTaskData(singleData)
    setSingleTaskModal(true)
  }

  const closeEstimationModal = () => {
    setIsEstimationModalOpen(false)
    setSelectedTask(null)
  }

  useEffect(() => {
    if (selectedProject) {
      const filtered = tasks.filter((task) => task.project_id._id === selectedProject._id)
      setFilteredTasks(filtered)
    } else {
      setFilteredTasks(tasks)
    }
  }, [selectedProject, tasks])

  return (
    <>
      <div className="topTabMenuHeader">
        <div>Estimation</div>
        <ProjectFilter selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
      </div>
      <div className="topTabMenuBodyOverlay cardOverflowStik">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader speed="fast" size="md" />
          </div>
        ) : filteredTasks.length !== 0 ? (
          filteredTasks.map((val, index) => (
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
                  {/* <div
                    className={`rounded-full  font-semibold tracking-wider  text-[12px] text-center px-2 py-0.5 border border-yellow-700 text-yellow-800 bg-yellow-800/10`}
                  >
                    {val.status != '6' ? 'Waiting For Approval' : ' Pending'}
                  </div> */}
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
                    {val.task_description&& (
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
                  <div
                    className={`rounded-full  font-semibold tracking-wider  text-[12px] text-center px-2 py-0.5 border border-yellow-700 text-yellow-800 bg-yellow-800/10`}
                  >
                    {val.status != '6' ? 'Waiting ' : ' Pending'}
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

                <div className=" w-fit  self-center">
                  {val.status == '6' ? (
                    <button
                      className="rounded-xl  mx-auto py-1 px-2 text-white font-medium text-sm bg-darkBlue hover:bg-blue-700 transition duration-200 flex gap-2 items-center"
                      onClick={(event) => openEstimationModal(event, val)}
                    >
                      <MdOutlineDateRange size={16} /> <span>Add Est Time</span>
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
              {/* <div className="truncate mt-3 ms-1 text-dark/50  border-borderGray ">
                <span className="text-dark font-medium">Description : </span>
                {val?.task_description && val.task_description.split(' ').length > 10
                  ? val.task_description.split(' ').slice(0, 10).join(' ') + '...'
                  : val?.task_description || ''}
              </div> */}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-dark/50">No tasks found</div>{' '}
          </div>
        )}
        {isEstimationModalOpen && (
          <QAEstimationTimeModal
            isOpen={isEstimationModalOpen}
            onClose={closeEstimationModal}
            task={selectedTask}
          />
        )}
        {singleTaskModal && (
          <SingleTaskDetailModal
            singleTaskModal={singleTaskModal}
            setSingleTaskModal={setSingleTaskModal}
            data={singleTaskData}
            isEstimation={true}
          />
        )}
      </div>
    </>
  )
}

export default QAEstimationTask
