import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.user)

  const handleValueChange = (event) => {
    const { id, value } = event.target
    setUserData({ ...userData, [id]: value })
  }

  const handleSubmit = () => {
    try {
      dispatch(registerUser(userData)).then((response) => {
        if (!response?.error) {
          navigate('/login')
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">EC</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Join E Commerce today</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                id="name"
                type="text"
                placeholder="Enter your full name"
                onChange={handleValueChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleValueChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                id="phone_number"
                type="tel"
                placeholder="Enter your phone number"
                onChange={handleValueChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                id="password"
                type="password"
                placeholder="Create a password"
                onChange={handleValueChange}
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                id="address"
                type="text"
                placeholder="Enter your delivery address"
                onChange={handleValueChange}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ {error}
                </p>
              </div>
            )}

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-purple-600 hover:text-purple-500 font-semibold">
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;