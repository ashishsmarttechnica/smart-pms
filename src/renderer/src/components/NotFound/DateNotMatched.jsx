import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function DateNotMatched() {
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(navigator.onLine) // Initial state based on current connectivity

  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine)
    if (navigator.onLine) {
      navigate('/home') // Navigate to home if offline
    }
  }

  useEffect(() => {
    // Event listeners for online and offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Check connectivity on component mount
    if (navigator.onLine) {
      navigate('/home')
    }

    return () => {
      // Cleanup event listeners
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">No Internet Connection</h1>
        <svg
          className="w-24 h-24 mx-auto text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8l-4-4m0 0l-4 4m4-4v16"
          />
        </svg>
        <p className="text-gray-700 mb-6">
          It seems your device is currently offline. Please check your internet connection and try
          again.
        </p>
        <button
          disabled
          className="bg-danger text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Check Internet and Retry
        </button>
      </div>
    </div>
  )
}

export default DateNotMatched
