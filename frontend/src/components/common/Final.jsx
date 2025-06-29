import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, ShoppingOutlined, HomeOutlined } from '@ant-design/icons';

const Final = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {showConfetti && (
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-70"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 text-center bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 max-w-2xl mx-4">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center mb-6 animate-pulse">
            <CheckCircleOutlined className="text-white text-4xl" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Thank You!</h1>
            <h2 className="text-2xl font-semibold text-green-600">Purchase Completed Successfully</h2>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8 space-y-4">
          <p className="text-lg text-gray-700">
            🎉 Your order has been placed successfully!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✅ Payment confirmed and processed
            </p>
            <p className="text-green-600 text-sm mt-1">
              You will receive an order confirmation email shortly
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <span className="text-gray-700">Order confirmation email sent</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm">2</span>
              </div>
              <span className="text-gray-700">Processing and packaging</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <span className="text-gray-700">Delivery to your address</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <ShoppingOutlined />
            <span>Continue Shopping</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <HomeOutlined />
            <span>Go to Home</span>
          </button>
        </div>

        {/* Footer Message */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Final