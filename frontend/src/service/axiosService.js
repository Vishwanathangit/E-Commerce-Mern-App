import axios from 'axios';
import { auth } from '../config/firebase';

// Function to make a request with an authentication token and request body
export const makeAuthenticatedRequest = async (uri, method, data = []) => {
  try {
    const reqEndpoint = `${import.meta.env.VITE_LOCAL_URL}${uri}`;
    const response = await axios({
      url: reqEndpoint,
      data: data,
      method: method,
    });
    return response;
  } catch (error) {
    console.error('Axios Error:', error);
    if (error.response && error.response.status === 413) {
      throw new Error('Payload too large. Please select a smaller image (under 5MB).');
    }
    throw error; // Re-throw other errors for handling elsewhere
  }
};

axios.interceptors.request.use(
  async (config) => {
    // Wait for Firebase authentication to initialize
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve();
      });
    });
    // Get current user from Firebase
    const user = auth.currentUser;
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      const refreshToken = idTokenResult.token;
      config.headers['Authorization'] = refreshToken;
    } else {
      console.error('Unauthorized: No user is currently logged in.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);