import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './components/home/Home'
import Login from './components/login/Login'
import DateNotMatched from './components/NotFound/DateNotMatched'
import TrackerWidget from './Pages/TrackerWidget'
import AfkUser from './Pages/AfkUser'
import { useDispatch } from 'react-redux'
import { getAdminDetails } from '../../Services/Redux/Action/AuthAction'
import AuthSecureRoutes from './Routes/AuthSecureRoute'
import PrivateSecureRoutes from './Routes/PrivateSecureRoute'
import './style.css'
const App = () => {
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const dispatch = useDispatch()

  // Update connectivity status
  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine)
    if (!navigator.onLine) {
      navigate('/not-match-date')
    }
  }

  useEffect(() => {
    // Add event listeners for online/offline status
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Check connectivity on initial load
    if (!navigator.onLine) {
      navigate('/not-match-date')
    }

    return () => {
      // Cleanup listeners
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [navigate])

  // Authentication check when the app loads
  useEffect(() => {
    const auth = localStorage.getItem('token')
    if (auth) {
      dispatch(getAdminDetails(auth)).then((res) => {
        if (!res?.success) {
          localStorage.clear()
          navigate('/')
        }
      })
    }
  }, [dispatch, navigate])

  return (
    <div className="w-full h-full">
      <Routes>
        {/* Routes for unauthenticated users */}
        <Route element={<AuthSecureRoutes />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* Routes for authenticated users */}
        <Route element={<PrivateSecureRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/afk-user" element={<AfkUser />} />
          <Route path="/tracker-widget" element={<TrackerWidget />} />
        </Route>

        {/* Route for Date Not Matched */}
        <Route path="/not-match-date" element={<DateNotMatched />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{ fontSize: '14px', border: '1px solid #bbb' }}
      />
    </div>
  )
}

export default App
