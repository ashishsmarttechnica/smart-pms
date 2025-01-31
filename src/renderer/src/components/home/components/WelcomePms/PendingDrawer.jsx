import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Drawer, Tooltip, Whisper } from 'rsuite'
import { getMeetingSchedule } from '../../../../../../Services/Redux/Action/MeetingScheduleAction'
import { url } from '../../../../../../url'
import MeetingSkeleton from './MeetingSkeleton'
import { motion } from 'framer-motion'

const PendingDrawer = ({ pemdingDrawerOpen, setPemdingDrawerOpen, pendingStatus }) => {
  const { meetingSchedule, loading, error } = useSelector((state) => state.meetingSchedule)
  const dispatch = useDispatch()

  useEffect(() => {
    if (pemdingDrawerOpen) {
      dispatch(getMeetingSchedule(pendingStatus))
    }
  }, [pemdingDrawerOpen])

  return (
    <>
      <Drawer open={pemdingDrawerOpen} onClose={() => setPemdingDrawerOpen(false)}>
        <Drawer.Header className="!py-2">
          <Drawer.Title>Pending</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="!p-4  border-y border-dark">
          <div className="space-y-2">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <MeetingSkeleton />
              </motion.div>
            ) : (
              meetingSchedule.map((val) => (
                <motion.div
                  key={val._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.7 }}
                  className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-400"
                >
                  <div className="bg-dark p-2 flex justify-between items-center">
                    <div className="text-white font-medium text-lg">
                      <div className="flex gap-2">
                        {val.team_members.slice(0, 4).map((user) =>
                          user?.img ? (
                            <Whisper
                              key={user._id}
                              placement="top"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  <div className="text-base capitalize">
                                    {user.first_name} {user.last_name}
                                  </div>
                                </Tooltip>
                              } // Tooltip to show full name
                            >
                              <img
                                src={`${url}/${user?.img}`}
                                alt="dummy"
                                className="rounded-full w-12 h-12"
                                onError={(e) => {
                                  e.target.onerror = null // Prevents infinite loop if the fallback image also fails
                                  e.target.src =
                                    `https://via.placeholder.com/150/`
                                }}
                              />
                            </Whisper>
                          ) : (
                            <Whisper
                              key={user._id}
                              placement="top"
                              trigger="hover"
                              speaker={
                                <Tooltip>
                                  <div className="text-base capitalize">
                                    {user.first_name} {user.last_name}
                                  </div>
                                </Tooltip>
                              } // Tooltip to show full name
                            >
                              <div
                                key={user._id}
                                className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center text-dark font-bold text-lg uppercase"
                              >
                                {user.first_name.charAt(0)}
                                {user.last_name.charAt(0)}
                              </div>
                            </Whisper>
                          )
                        )}
                        {val.team_members.length > 4 && (
                          <div className="rounded-full w-12 h-12 bg-gray-300 flex items-center justify-center text-dark font-bold text-lg">
                            +{val.team_members.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-darkBlue/20 border border-darkBlue text-white px-4 py-1 rounded-md text-base font-medium  transition-colors">
                        {val.status == 0 && 'Waiting for approval'}
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-2 text-base items-center space-y-0">
                      <p className="text-gray-700 ">
                        <span className="font-semibold">Date :</span>{' '}
                        {new Date(val.date).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold"> Start Time :</span> {val.start_time}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold"> End Time :</span> {val.end_time}
                      </p>
                    </div>
                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold ">Requester Name : </span>
                      {val.user_id?.first_name} {val.user_id?.last_name} {val.user_id?.surname}
                    </p>

                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold ">Project Name : </span>
                      {val.project_id?.name}
                    </p>

                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold "> Agenda : </span>
                      {val.agenda}
                    </p>
                    <p className="text-gray-700 text-base mt-2">
                      <span className="font-semibold "> Description : </span>
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  )
}

export default PendingDrawer
