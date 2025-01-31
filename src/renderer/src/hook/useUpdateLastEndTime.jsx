import { useState, useEffect } from 'react'

const useUpdateLastEndTime = (activeTab, isCleanupComplete) => {
  const [lastEndTime, setLastEndTime] = useState(localStorage.getItem('LastEndTime') || '')

  useEffect(() => {
    let timer
    if (activeTab !== 'today' && isCleanupComplete) {
      timer = setInterval(() => {
        const newEndTime = new Date().toUTCString()
        localStorage.setItem('LastEndTime', newEndTime)
        setLastEndTime(newEndTime)
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [activeTab, isCleanupComplete])

  return lastEndTime
}

export default useUpdateLastEndTime
