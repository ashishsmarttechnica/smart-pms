import React, { useState } from 'react'
import { useEffect } from 'react'
import logo from '../../assets/logo.png'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { adminLogin } from '../../../../Services/Redux/Action/AuthAction'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [loading, setLoading] = useState(false)
  // State to manage form input values
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
    // keepLoggedIn: false
  })

  // Handle input change
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    if (!formData.email || !formData.password) {
      toast.error('Please fill out all fields.')
      setLoading(false)
      return
    }

    dispatch(adminLogin(formData)).then((res) => {
      if (res.success) {
        localStorage.setItem('userId', res.data._id)
        localStorage.setItem('companyId', res.data.company_id)
        localStorage.setItem('role', res.data.role)
        toast.success(res.message)
        setLoading(false)
        navigate('/home')
      } else {
        toast.error(res.message)
        setLoading(false)
      }
    })
  }

  return (
    <div className="login-bg flex-center flex-col w-full h-full px-4">
      <div className="mb-12.5">
        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      <form className="w-full max-w-[592px]" onSubmit={handleSubmit}>
        <div className="mb-[30px]">
          <input
            type="email"
            className="appearance-none border border-primary/50 rounded-[16px] w-full text-base py-4 px-5 text-gray-700 mb-3 focus:ring-1 focus:outline-none focus:border-primary"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />



        </div>
        <div className="mb-[30px]">
          <input
            type="password"
            className="appearance-none border border-primary/50 rounded-[16px] w-full text-base py-4 px-5 text-gray-700 mb-3 focus:ring-1 focus:outline-none focus:border-primary"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Checkbox */}

        {/* <div className="mb-[30px] flex items-center">
          <input
            type="checkbox"
            id="keepLoggedIn"
            className="mx-2 w-4 h-4"
            checked={formData.keepLoggedIn}
            onChange={handleChange}
          />
          <label htmlFor="keepLoggedIn" className="text-gray-700 text-sm">
            Keep me logged in
          </label>
        </div> */}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-[10px] focus:outline-none focus:shadow-outline w-full max-w-[250px] transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
