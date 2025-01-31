import { useSelector } from 'react-redux'
import VDots from '../../../../../svg/VDots'
import SingleTaskDetailModal from '../TaskTabs/SingleTaskDetailModal'
import { useState } from 'react'
import formatTime from '../../../../../utils/formatTime'
import QATaskProgress from '../QATaskProgress'
import QATaskProgressActive from '../QATaskProgressActive'
import { Loader, Tooltip, Whisper } from 'rsuite'
import { FaBomb, FaImage } from 'react-icons/fa'
import { openLinkInBrowser } from '../../../../../utils/openLinkInBrowser'
import { GrAttachment } from 'react-icons/gr'
import BugSvg from '../../../../../assets/svgs/BugSvg'
import ImprovementSvg from '../../../../../assets/svgs/ImprovementSvg'
import ChangesSvg from '../../../../../assets/svgs/ChangesSvg'
import { ImForward } from 'react-icons/im'
import { MdDescription } from 'react-icons/md'

const QACompleteTaskTab = () => {
  const { tasks, error, loading } = useSelector((state) => state.taskList)
  const [singleTaskModal, setSingleTaskModal] = useState(false)
  const [singleTaskData, setSingleTaskData] = useState({})

  const handleSingleDataShow = (singleData) => {
    setSingleTaskData(singleData)
    setSingleTaskModal(true)
  }
  return (
    <>
      <div className="topTabMenuHeader">
        <div>Complete</div>
      </div>
      <div className="topTabMenuBodyOverlay cardOverflowStik">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader speed="fast" size="md" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-dark/50">No tasks found</div>
          </div>
        ) : (
          tasks.map((val, index) => (
            <div
              key={val._id}
              className="border-b border-borderGray p-2 pb-3  hover:bg-slate-100 transition-all duration-100 cursor-default"
              onClick={() => handleSingleDataShow(val)}
            >
              <div className="flex  items-end justify-between relative">
                <div className="absolute top-0 flex gap-1 items-center w-[80%]">
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

                  {/* <div className="rounded-full  font-semibold tracking-wider  text-[12px] text-center px-2 py-0.5 border border-green-700 text-green-800 bg-green-800/10">
                    Complete
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
                        <div className="ml-auto">
                          <FaImage size={20} />
                        </div>
                      </Whisper>
                    )}
                  </div>
                </div>
                <div className="w-[80%]  pl-1  flex justify-between items-center ">
                  <div className="text-dark text-base font-medium text-nowrap truncate w-[90%]">
                    {' '}
                    {val.task}
                  </div>
                  <div className="rounded-full  font-semibold tracking-wider  text-[12px] text-center px-2 py-0.5 border border-green-700 text-green-800 bg-green-800/10">
                    Complete
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
                <div>
                  {/* task progress */}
                  {/* <TaskProgress
                    progressData={{
                    '#0E7C26': 20,
                    '#EF980B': 10
                    }}
                /> */}
                </div>
                {/* time converter */}

                <div className="w-[20px] self-center">
                  {/* v dots */}
                  <VDots isDark />
                </div>
              </div>
              {/* <div className="mt-2">
                <QATaskProgress val={val} />
              </div> */}

              {/* <div className="truncate mt-3 ms-1 text-dark/50  border-borderGray ">
                <span className="text-dark font-medium">Description : </span>
                {val?.task_description && val.task_description.split(' ').length > 10
                  ? val.task_description.split(' ').slice(0, 10).join(' ') + '...'
                  : val?.task_description || ''}
              </div> */}
            </div>
          ))
        )}

        {singleTaskModal && (
          <SingleTaskDetailModal
            singleTaskModal={singleTaskModal}
            setSingleTaskModal={setSingleTaskModal}
            data={singleTaskData}
            isEstimation={true}
            iscomplete={true}
          />
        )}
      </div>
    </>
  )
}

export default QACompleteTaskTab
