import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTaskUserList, // Redux action to fetch the list of users for the task
  TaskForwardUser // Redux action to forward the task to a user
} from '../../../../../Services/Redux/Action/TaskUserAction'
import { getTaskList } from '../../../../../Services/Redux/Action/TaskAction' // Redux action to fetch the updated task list
import { TiArrowForward } from 'react-icons/ti' // Icon for the forward button
import { Loader } from 'rsuite' // Loading spinner from `rsuite`
import calculateDuration from '../../../utils/calculateDuration'
import { updateTaskTimer } from '../../../../../Services/Redux/Action/TaskTimerAction'
import ActiveTabContext from '../../../Context/ActiveTabContext'

const ForwardUser = ({ singleData, islast }) => {
  // State to handle dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false)
  const startedTaskDate = localStorage.getItem('startedTaskDate')
  const { trackerWidget, activeTab } = useContext(ActiveTabContext)
  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null)
  const activeTaskId = localStorage.getItem('activeTaskId')
  // Redux selector to get task user details from the store
  const TaskUserData = useSelector((state) => state.taskUserDetails)

  // Redux dispatcher to call actions
  const dispatch = useDispatch()

  // Logged-in user's ID from local storage
  const userId = localStorage.getItem('userId')

  // Toggles the dropdown visibility
  const toggleDropdown = (event) => {
    event.stopPropagation() // Prevents click propagation to avoid unexpected behavior
    setShowDropdown((prev) => !prev)
    dispatch(
      getTaskUserList({
        project_id: singleData?.project_id?._id, // Project ID to filter users
        task_id: singleData._id // Current task ID
      })
    )
  }

  // Handles task forwarding to the selected user
  const hendleForwardTask = (singleforwardData) => {
    // console.log(singleforwardData.role, 'this isa single forward data')

    dispatch(
      TaskForwardUser({
        userId: singleforwardData._id,
        task_id: singleData._id,
        role: singleforwardData.role
      })
    ).then((res) => {
      if (activeTaskId) {
        trackerWidget(false)
        if (res.success) {
          dispatch(
            updateTaskTimer({
              user_id: localStorage.getItem('userId'),
              task_id: localStorage.getItem('activeTaskId'),
              startdate: startedTaskDate,
              enddate: new Date().toUTCString(),
              duration: calculateDuration(startedTaskDate, new Date().toUTCString())
            })
          ).then((res) => {
            if (res.success) {
              localStorage.removeItem('TaskTimerId')
              localStorage.removeItem('startedTaskDate')
              localStorage.removeItem('startedTaskDateForLoop')
              localStorage.removeItem('activeTaskId')
              localStorage.removeItem('curruntTotalTime')
              localStorage.removeItem('activeProjectId')
              localStorage.removeItem('updatedTaskDate')
            }
          })
          // If forwarding is successful, fetch the updated task list
          // dispatch(getTaskList('2,3,4'))
        }
      }

      if (activeTab == 'complete') {
        dispatch(getTaskList('5'))
      } else {
        dispatch(getTaskList('2,3,4'))
      }
    })
  }

  // Closes the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false) // Close the dropdown
      }
    }

    document.addEventListener('mousedown', handleOutsideClick) // Attach event listener on mount
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick) // Clean up event listener on unmount
    }
  }, [])

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Button to toggle the dropdown */}
      <div
        onClick={toggleDropdown}
        className="rounded-full p-1 text-white font-medium text-sm bg-red-600 hover:bg-red-700 transition duration-200"
      >
        <TiArrowForward size={22} /> {/* Forward icon */}
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <div
          className={`absolute ${
            islast ? 'bottom-full' : ''
          } right-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-40 min-h-[110px] overflow-y-auto h-full cardOverflowStik`}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          {/* Show loader if data is loading */}
          {TaskUserData.loading ? (
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center align-middle">
              <Loader speed="fast" /> {/* Loader component */}
            </div>
          ) : (
            <ul className="m-0">
              {/* Map over the list of total members to display them */}
              {TaskUserData.data.total_members.map(
                (val) =>
                  val._id !== userId && ( // Exclude the current logged-in user
                    <div
                      key={val._id} // Unique key for each user
                      onClick={() => hendleForwardTask(val)} // Forward task to this user
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {val.first_name} {/* Display user's first name */}
                    </div>
                  )
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default ForwardUser
