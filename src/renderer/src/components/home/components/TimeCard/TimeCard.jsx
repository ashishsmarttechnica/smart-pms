import React, { useContext, useEffect, useState } from 'react'
import PlusSvg from './../../../../svg/PlusSvg'
import CreateTaskForUserModal from '../TaskCard/CreateTaskForUserModal'
import { getUserDetail } from '../../../../../../Services/Redux/Action/UserDetailction'
import { useDispatch, useSelector } from 'react-redux'
import formatTime from '../../../../utils/formatTime'
import { getPermissions } from '../../../../utils/Permissions'
import ActiveTabContext from '../../../../Context/ActiveTabContext'
import { toast } from 'react-toastify'
import { getSingleUser } from '../../../../../../Services/Redux/Action/UserAction'

const TimeCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { permissions, setPermissions } = useContext(ActiveTabContext)

  const dispatch = useDispatch()
  const userTimeData = useSelector((state) => state.userAllTImeData)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const hendlemodalOpen = () => {
    dispatch(getSingleUser()).then((res) => {
      if (res.success) {
        setPermissions(res.data.app_permission)
        const { canAddTask } = getPermissions(res.data.app_permission)
        if (canAddTask) {
          openModal()
        } else {
          toast.error('You do not have permission to add task')
        }
      }
    })
  }
  useEffect(() => {
    dispatch(getUserDetail())
  }, [dispatch])

  return (
    <div className="flex items-center justify-between border-b border-borderGray">
      {userTimeData.loading ? (
        <div className="flex items-center gap-5 py-4">
          {/* Dummy skeleton cards using loop */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="py-3 px-4 border rounded-[8px] bg-gray-200 w-[156px] animate-pulse"
            >
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-5 py-4 ">
          <div className="py-3 px-4 border border-darkBlue rounded-[8px] bg-lightBlue w-[156px]">
            <div className="text-darkBlue font-semibold">Today</div>
            <div className="text-darkBlue font-semibold">
              {formatTime(userTimeData.data.todayTime)}
            </div>
          </div>
          <div className="py-3 px-4 border border-darkPink rounded-[8px] bg-lightPink w-[156px]">
            <div className="text-darkPink font-semibold">Yesterday</div>
            <div className="text-darkPink font-semibold">
              {formatTime(userTimeData.data.yesterdayTime)}
            </div>
          </div>
          <div className="py-3 px-4 border border-darkGreen rounded-[8px] bg-lightGreen w-[156px]">
            <div className="text-darkGreen font-semibold">This week</div>
            <div className="text-darkGreen font-semibold">
              {formatTime(userTimeData.data.thisWeekTime)}
            </div>
          </div>
          <div className="py-3 px-4 border border-darkOrange rounded-[8px] bg-lightOrange w-[156px]">
            <div className="text-darkOrange font-semibold">This Month</div>
            <div className="text-darkOrange font-semibold">
              {formatTime(userTimeData.data.thisMonthTime)}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <button
          onClick={() => hendlemodalOpen()}
          className=" bg-darkBlue flex items-center justify-center   w-12 h-12 rounded-[12px] font-semibold "
        >
          <PlusSvg />
        </button>
      </div>
      <CreateTaskForUserModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default TimeCard
