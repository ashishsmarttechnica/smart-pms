import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const ErrorRoute = () => {
  const [isnav, setIsnav] = useState(false)
  const checkSystemTime = async () => {
    try {
      if (window.electron) {
        const timeDifference = await window.electron.invoke('check-system-time')

        if (!timeDifference.isTimeAccurate) {
          setIsnav(true)
        }
      } else {
        console.error('Electron API is not available')
      }
    } catch (error) {
      console.error('Error checking system time:', error)
    }
  }

  useEffect(() => {
    checkSystemTime()
  }, [])

  return isnav ? <Navigate to="/not-match-date" /> : <Outlet />
}

export default ErrorRoute
