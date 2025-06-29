import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCheckout } from '../../store/userStore';
import { makeAuthenticatedRequest } from '../../service/axiosService';

const Checkout = () => {
  const { userData, checkoutProducts } = useSelector((state) => state.user);
  const totalPrice = checkoutProducts.reduce((acc, curr) => Number(acc) + Number(curr.price), 0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      // Check if script is already loaded
      if (window.Razorpay) {
        setScriptLoaded(true);
        const key = import.meta.env.VITE_RAZORPAY_KEY;
        if (!key || key.trim() === '') {
          console.error('Razorpay key is missing or invalid in .env file');
          alert('Razorpay key is not configured. Please check your .env file.');
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
        // Set Razorpay key from environment variable
        const key = import.meta.env.VITE_RAZORPAY_KEY;
        if (!key || key.trim() === '') {
          console.error('Razorpay key is missing or invalid in .env file');
          alert('Razorpay key is not configured. Please check your .env file.');
        } else {
          setRazorpayKey(key);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        alert('Failed to load payment gateway. Please try again later.');
      };
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (!existingScript) {
        document.body.appendChild(script);
      }
    };

    loadRazorpayScript();

    // Cleanup function
    return () => {
      // Don't remove script on cleanup as it might be needed elsewhere
    };
  }, []);

  const initPayment = (data) => {
    console.log('Initializing payment with data:', data);
    
    if (!scriptLoaded || !window.Razorpay || !razorpayKey) {
      console.error('Razorpay not ready:', { scriptLoaded, razorpayKey, windowRazorpay: !!window.Razorpay });
      alert('Payment gateway not available. Please ensure Razorpay key is set and try again.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: data.currency || 'INR',
      name: 'EMKart Store', // Your store name
      description: `Order payment for ${checkoutProducts.length} item(s)`,
      order_id: data.id,
      image: 'https://your-logo-url.com/logo.png', // Optional: Add your logo
      handler: async (response) => {
        console.log('Payment handler called with:', response);
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
          
          console.log('Verification response:', verificationResponse);
          
          if (verificationResponse.status === 200) {
            dispatch(clearCheckout());
            alert('Payment successful! Redirecting...');
            navigate('/finalFun');
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed. Please contact support if money was debited.');
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
        contact: userData?.phone || ''
      },
      notes: {
        address: 'Customer Address',
        merchant_order_id: Date.now().toString()
      },
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal dismissed by user');
          setIsProcessing(false);
        },
        escape: true,
        backdropclose: false
      },
      retry: {
        enabled: true,
        max_count: 3
      }
    };

    console.log('Razorpay options:', options);

    try {
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', (response) => {
        console.error('Payment failed event:', response);
        alert('Payment failed: ' + (response.error?.description || 'Unknown error occurred'));
        setIsProcessing(false);
      });
      
      // Add timeout to prevent infinite processing
      const paymentTimeout = setTimeout(() => {
        console.log('Payment timeout - resetting processing state');
        setIsProcessing(false);
      }, 300000); // 5 minutes timeout
      
      rzp1.open();
      
      // Clear timeout if payment completes
      rzp1.on('payment.success', () => clearTimeout(paymentTimeout));
      rzp1.on('payment.failed', () => clearTimeout(paymentTimeout));
      
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      alert('Failed to initialize payment gateway. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!scriptLoaded || !razorpayKey) {
      alert('Payment gateway is not ready. Please wait or check configuration.');
      return;
    }

    if (isProcessing) {
      alert('Payment is already being processed. Please wait.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Initiating payment for amount:', totalPrice);
      
      const response = await makeAuthenticatedRequest(
        'api/product/checkoutProducts', 
        'POST', 
        { 
          amount: Math.round(totalPrice * 100), // Convert to paise
          currency: 'INR',
          products: checkoutProducts.map(p => ({ id: p.id, title: p.title, price: p.price }))
        }
      );
      
      console.log('Server response:', response);
      
      // Handle different possible response structures
      let orderData = null;
      if (response.data && response.data.data) {
        orderData = response.data.data;
      } else if (response.data && response.data.order) {
        orderData = response.data.order;
      } else if (response.data && response.data.id) {
        // Direct order data
        orderData = response.data;
      } else {
        throw new Error('Invalid response from server: ' + JSON.stringify(response.data));
      }
      
      // Ensure required fields are present
      if (!orderData.id || !orderData.amount) {
        throw new Error('Invalid order data received from server');
      }
      
      initPayment(orderData);
    } catch (error) {
      console.error('Checkout error:', error);
      
      // More detailed error handling
      let errorMessage = 'Failed to initiate payment. ';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage += 'Please login again.';
          // Optionally redirect to login
          // navigate('/login');
        } else if (error.response.status === 400) {
          errorMessage += `Invalid request: ${error.response.data?.message || 'Please check your cart'}`;
        } else if (error.response.status >= 500) {
          errorMessage += 'Server error. Please try again later.';
        } else {
          errorMessage += `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else {
        errorMessage += error.message || 'Unknown error occurred.';
      }
      
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      {totalPrice <= 0 ? (
        <div className="text-center py-8">
          <h1 className="text-xl text-gray-600">Your cart is empty</h1>
          <button 
            onClick={() => navigate('/products')} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {checkoutProducts.map((product) => (
            <div className="border rounded-lg p-4 shadow-sm" key={product.id}>
              <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 text-xl font-bold">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
      
      {totalPrice > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Items ({checkoutProducts.length})</span>
              <span className="font-semibold">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
          
          <button
            className={`w-full mt-6 px-6 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
              totalPrice <= 0 || !scriptLoaded || !razorpayKey || isProcessing
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
            }`}
            onClick={handlePayment}
            disabled={totalPrice <= 0 || !scriptLoaded || !razorpayKey || isProcessing}
          >
            {isProcessing 
              ? 'Processing...' 
              : !scriptLoaded || !razorpayKey 
                ? 'Loading Payment Gateway...' 
                : `Pay ₹${totalPrice}`
            }
          </button>
          
          {/* Debug/Reset button - Remove in production */}
          {isProcessing && (
            <button
              className="w-full mt-2 px-4 py-2 rounded-full text-sm bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                setIsProcessing(false);
                console.log('Payment processing state reset');
              }}
            >
              Reset (Debug)
            </button>
          )}
          
          <p className="text-sm text-gray-500 text-center mt-2">
            Secure payment powered by Razorpay
          </p>
          
          {/* Debug info - Remove in production */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
            <div>Script Loaded: {scriptLoaded ? '✅' : '❌'}</div>
            <div>Razorpay Key: {razorpayKey ? '✅' : '❌'}</div>
            <div>Window.Razorpay: {typeof window !== 'undefined' && window.Razorpay ? '✅' : '❌'}</div>
            <div>Processing: {isProcessing ? '⏳' : '✅'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;