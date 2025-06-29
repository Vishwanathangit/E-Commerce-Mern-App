import React, { useState } from 'react'
import { loginUser } from '../../store/userStore';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userData, setUserData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleValueChange = (event) => {
    const { id, value } = event.target
    setUserData({ ...userData, [id]: value })
  }

  const handleSubmit = async () => {
    dispatch(loginUser(userData)).then((res) => {
      if (!res?.error) {
        navigate("/")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">EC</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your E Commerce account</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleValueChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleValueChange}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ {error.message}
                </p>
              </div>
            )}

            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                  Sign up here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;