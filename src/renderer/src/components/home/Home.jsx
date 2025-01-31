import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReminderNotification from './components/ReminderNotification'
import WelcomePms from './components/WelcomePms/WelcomePms'
import TaskCard from './components/TaskCard/TaskCard'
import TimeCard from './components/TimeCard/TimeCard'
import { Button } from 'rsuite'
import ActiveTabContext from '../../Context/ActiveTabContext'

const Home = () => {
  // const [isCapturing, setIsCapturing] = useState(false)
  const { trackerWidget } = useContext(ActiveTabContext)
  // const startCapturingScreenshots = async () => {
  //   try {
  //     if (window.electron) {
  //       await window.electron.invoke('start-capturing-screenshots')
  //
  //     } else {
  //       console.error('Electron API is not available')
  //     }
  //   } catch (error) {
  //     console.error('Error starting screenshot capture:', error)
  //   }
  // }

  // const pauseCapturingScreenshots = async () => {
  //   try {
  //     if (window.electron) {
  //       await window.electron.invoke('pause-capturing-screenshots')
  //
  //     } else {
  //       console.error('Electron API is not available')
  //     }
  //   } catch (error) {
  //     console.error('Error stopping screenshot capture:', error)
  //   }
  // }

  return (
    <>
      {/* <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Screenshot Capture
          </h1>
          <button
            onClick={isCapturing ? pauseCapturingScreenshots : startCapturingScreenshots}
            className={`px-6 py-3 rounded-lg text-white font-semibold focus:outline-none transition-all duration-300
          ${isCapturing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isCapturing ? 'Stop Capturing Screenshots' : 'Start Capturing Screenshots'}
          </button>
        </div>
      </div> */}
      <div>
        <ReminderNotification />

        {/* <div className=" absolute z-50 left-1/2 -translate-x-1/2 top-14 flex items-center gap-2">
          <Button onClick={() => trackerWidget(true)} appearance="primary" size="sm">
            open
          </Button>
          <Button onClick={() => trackerWidget(false)} appearance="primary" size="sm">
            close
          </Button>
        </div> */}
        <div className="px-5">
          <WelcomePms />
          <TimeCard />
          <TaskCard />
        </div>
      </div>
    </>
  )
}

export default Home
