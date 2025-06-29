import React, { useState } from 'react'
import { loginUser } from '../../store/userStore';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
  

const Login = () => {
  const [userData, setUserData] = useState({})
  const {loading, error} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleValueChange = (event) => {
    const {id, value} = event.target
    setUserData({...userData, [id] : value })
  }

  const handleSubmit = async () => {
    dispatch(loginUser(userData)).then((res) => {
        if (!res?.error) {
          navigate("/")
        }
    })
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto">            
        <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
          <p className="text-black-700 text-xl text-center font-bold mb-2">EMCKart Login</p>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              onChange={(event) => handleValueChange(event)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(event) => handleValueChange(event)}
            />
          </div>
          {error && <label className="block text-red-500 text-sm font-bold mb-2">* {error.message}</label>}
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login" }
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
