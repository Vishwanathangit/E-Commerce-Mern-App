import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCheckout } from '../../store/userStore';
import { makeAuthenticatedRequest } from '../../service/axiosService';
import { ShoppingCartOutlined, CreditCardOutlined, SafetyOutlined, DeleteOutlined } from '@ant-design/icons';

const Checkout = () => {
  const { userData, checkoutProducts } = useSelector((state) => state.user);
  const totalPrice = checkoutProducts.reduce((acc, curr) => Number(acc) + Number(curr.price), 0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        setScriptLoaded(true);
        const key = import.meta.env.VITE_RAZORPAY_KEY;
        if (!key || key.trim() === '') {
          console.error('Razorpay key is missing or invalid in .env file');
        } else {
          setRazorpayKey(key);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        const key = import.meta.env.VITE_RAZORPAY_KEY;
        if (!key || key.trim() === '') {
          console.error('Razorpay key is missing or invalid in .env file');
        } else {
          setRazorpayKey(key);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
      };
      
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (!existingScript) {
        document.body.appendChild(script);
      }
    };

    loadRazorpayScript();
  }, []);

  const initPayment = (data) => {
    if (!scriptLoaded || !window.Razorpay || !razorpayKey) {
      console.error('Razorpay not ready');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: data.currency || 'INR',
      name: 'E Commerce Store',
      description: `Order payment for ${checkoutProducts.length} item(s)`,
      order_id: data.id,
      handler: async (response) => {
        try {
          const verificationResponse = await makeAuthenticatedRequest(
            'api/product/verifyCheckout', 
            'POST', 
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }
          );
          
          if (verificationResponse.status === 200) {
            dispatch(clearCheckout());
            navigate('/finalFun');
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
        contact: userData?.phone || ''
      },
      theme: {
        color: '#6366f1',
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
        escape: true,
        backdropclose: false
      }
    };

    try {
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', (response) => {
        console.error('Payment failed event:', response);
        setIsProcessing(false);
      });
      
      rzp1.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!scriptLoaded || !razorpayKey) {
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const response = await makeAuthenticatedRequest(
        'api/product/checkoutProducts', 
        'POST', 
        { 
          amount: Math.round(totalPrice * 100),
          currency: 'INR',
          products: checkoutProducts.map(p => ({ id: p.id, title: p.title, price: p.price }))
        }
      );
      
      let orderData = null;
      if (response.data && response.data.data) {
        orderData = response.data.data;
      } else if (response.data && response.data.order) {
        orderData = response.data.order;
      } else if (response.data && response.data.id) {
        orderData = response.data;
      } else {
        throw new Error('Invalid response from server: ' + JSON.stringify(response.data));
      }
      
      if (!orderData.id || !orderData.amount) {
        throw new Error('Invalid order data received from server');
      }
      
      initPayment(orderData);
    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
    }
  };

  if (totalPrice <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border border-gray-100">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mb-6">
            <ShoppingCartOutlined className="text-gray-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <ShoppingCartOutlined className="mr-3" />
                  Order Items ({checkoutProducts.length})
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {checkoutProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <img 
                      src={product.imageBase64} 
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{product.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <CreditCardOutlined className="mr-3" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Items ({checkoutProducts.length})</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!scriptLoaded || !razorpayKey || isProcessing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <SafetyOutlined />
                      <span>Pay ₹{totalPrice}</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <SafetyOutlined className="text-green-500" />
                    <span>Secure payment powered by Razorpay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;