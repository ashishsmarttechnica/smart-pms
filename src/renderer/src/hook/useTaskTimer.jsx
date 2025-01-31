import { useState, useEffect } from 'react'

const useTaskTimer = (start, totalTimeSpent) => {
  const [elapsedTime, setElapsedTime] = useState(totalTimeSpent) // Start from total time spent

  useEffect(() => {
    if (start) {
      const startTime = new Date(start).getTime()

      // Calculate elapsed time based on start time and total time spent
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const timeDiff = Math.floor((now - startTime) / 1000) // time difference in seconds
        setElapsedTime(totalTimeSpent + timeDiff) // Add initial time to the time difference
      }, 1000)

      return () => clearInterval(interval) // Cleanup on component unmount or task change
    }
  }, [start, totalTimeSpent])

  return elapsedTime
}

export default useTaskTimer
