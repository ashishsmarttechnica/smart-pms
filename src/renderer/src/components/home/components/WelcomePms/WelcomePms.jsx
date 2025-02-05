import React, { useContext, useEffect, useState } from 'react'
import SettingSvg from '../../../../svg/SettingSvg'
import VDots from '../../../../svg/VDots'
import { Badge, Button, Dropdown } from 'rsuite'
import RequestModal from './RequestModal'
import PendingDrawer from './PendingDrawer'
import ApprovedDrawer from './ApprovedDrawer'
import ActiveTabContext from '../../../../Context/ActiveTabContext'
import { getTaskList, updateTaskStatus } from '../../../../../../Services/Redux/Action/TaskAction'
import { useDispatch, useSelector } from 'react-redux'
import { updateTaskTimer } from '../../../../../../Services/Redux/Action/TaskTimerAction'
import calculateDuration from '../../../../utils/calculateDuration'
import { useNavigate } from 'react-router-dom'

const WelcomePms = () => {
  const [pemdingDrawerOpen, setPemdingDrawerOpen] = useState(false)
  const [requestDrawerOpen, setRequestDrawerOpen] = useState(false)
  const [openRqModal, setOpenRqModal] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userDetail = useSelector((state) => state.adminDetail.data)

  const { socketCount, startStopAFK, pauseCapturingScreenshots, trackerWidget } =
    useContext(ActiveTabContext)
  const handleOptions = () => {
    const activeTaskId = localStorage.getItem('activeTaskId')
    if (activeTaskId) {
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
          dispatch(updateTaskStatus(localStorage.getItem('activeTaskId'), 4)).then((res) => {
            if (res.success) {
              localStorage.clear()
              pauseCapturingScreenshots()
              trackerWidget(false)
              startStopAFK(false)
              navigate('/')
            }
          })
        }
      })
    } else {
      localStorage.clear()
      navigate('/')
    }
  }

  const hendelRqModalOpen = () => {
    setOpenRqModal(true)
  }
  const hendelRqMoldaClose = () => {
    setOpenRqModal(false)
  }

  return (
    <>
      <div className="flex items-center justify-between py-4 border-b border-borderGray">
        <div className="text-lg text-dark font-semibold">
          {/* Welcome to Smart PMS ✋ */}
          {userDetail.first_name} {userDetail.last_name} {userDetail.surname}   new relese
        </div>
        <div className="flex items-center gap-3">
          {socketCount.pendingMeetingCount > 0 ? (
            <Badge content={socketCount.pendingMeetingCount}>
              <Button
                color="red"
                appearance="primary"
                size="sm"
                onClick={() => setPemdingDrawerOpen(true)}
              >
                Pending
              </Button>
            </Badge>
          ) : (
            <Button
              color="red"
              appearance="primary"
              size="sm"
              onClick={() => setPemdingDrawerOpen(true)}
            >
              Pending
            </Button>
          )}
          {socketCount.approvedMeetingCount > 0 ? (
            <Badge content={socketCount.approvedMeetingCount}>
              <Button
                color="green"
                appearance="primary"
                size="sm"
                onClick={() => setRequestDrawerOpen(true)}
              >
                Approved
              </Button>
            </Badge>
          ) : (
            <Button
              color="green"
              appearance="primary"
              size="sm"
              onClick={() => setRequestDrawerOpen(true)}
            >
              Approved
            </Button>
          )}

          <Button onClick={hendelRqModalOpen} appearance="primary" size="sm">
            Request
          </Button>

          <button>
            <SettingSvg />
          </button>
          {/* <button className="flex items-center justify-center" onClick={() => handleOptions()}>
            <VDots />
          </button> */}

          <Dropdown
            placement="bottomEnd"
            renderToggle={(props, ref) => (
              <button ref={ref} {...props} className="flex items-center justify-center">
                <VDots />
              </button>
            )}
          >
            <Dropdown.Item onClick={() => handleOptions()}>Log out</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <ApprovedDrawer
        requestDrawerOpen={requestDrawerOpen}
        setRequestDrawerOpen={setRequestDrawerOpen}
        requestStatus={'1,5'}
      />
      <PendingDrawer
        pemdingDrawerOpen={pemdingDrawerOpen}
        setPemdingDrawerOpen={setPemdingDrawerOpen}
        pendingStatus={0}
      />
      <RequestModal openRqModal={openRqModal} hendelRqMoldaClose={hendelRqMoldaClose} />
    </>
  )
}

export default WelcomePms
