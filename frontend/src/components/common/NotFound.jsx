import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-9xl font-black text-gray-200 -z-10 transform translate-x-2 translate-y-2">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
            <p className="text-sm text-gray-700 mb-3">
              🤔 This could have happened because:
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                The page URL was typed incorrectly
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                The page has been moved or deleted
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                You don't have permission to access this page
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <HomeOutlined className="text-lg" />
            <span>Go Back Home</span>
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>← Go Back</span>
          </button>
        </div>

        {/* Fun Element */}
        <div className="mt-12">
          <div className="inline-block animate-bounce">
            <SearchOutlined className="text-4xl text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Lost in cyberspace? Don't worry, we'll help you find your way!
          </p>
        </div>
        
        {/* Floating Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="fixed bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="fixed top-1/2 right-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default NotFound;