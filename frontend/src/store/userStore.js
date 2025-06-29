import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseLogin, getUserAuthToken, signoutFirebaseUser } from '../service/firebaseService';
import axios from 'axios';
import {
    getDataFromLocalStorage,
    setDataInLocalStorage,
    removeDataFromLocalStorage } from '../service/localStorageService';

export const loginUser = createAsyncThunk(('user/login'), async(userData) => {
    const firebaseResponse = await firebaseLogin(userData)
    const userResponse = await axios.post(`${import.meta.env.VITE_LOCAL_URL}api/user/login`, firebaseResponse.user)
    const finalRes = await userResponse.data
    return finalRes
});

export const registerUser = createAsyncThunk(('user/register'), async(userData, { rejectWithValue }) => {
    try{
        const userResponse = await axios.post(`${import.meta.env.VITE_LOCAL_URL}api/user/register`, userData)
        return userResponse
    } catch (error) {
        if (error.response.status >= 400) {
            return rejectWithValue({ message: error.response.data.message })
          }
        return rejectWithValue({message: 'Some Other message'})
    }
});

//------------For Test----------------
export const vaildateToken = createAsyncThunk(('user/validateToken'), async(userData, { rejectWithValue }) => {
    try{
        const token = await getUserAuthToken()
        const userResponse = await axios.post('http://localhost:8080/api/user/validateToken', { authToken: token })
        return userResponse
    } catch (error) {
        if (error.response.status >= 400) {
            return rejectWithValue({ message: error.response.data.message })
          }
        return rejectWithValue({message: 'Some Other message'})
    }
});
//-----------------------------------

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    userData: getDataFromLocalStorage('user') || null,
    error: null,
    checkoutProducts: []
  },
  reducers: {
    clearUser: async (state) => {
        await signoutFirebaseUser()
        removeDataFromLocalStorage('user')
        state.loading = false,
        state.userData = null,
        state.error = null
    },
    addProductTOCheckout: (state, product) => {
        const index = state.checkoutProducts.findIndex(checkoutProduct => checkoutProduct.id === product.payload.id);
        if (index === -1) {
            state.checkoutProducts.push(product.payload);
        } else {
            state.checkoutProducts.splice(index, 1);
        }
    },
    clearCheckout : (state) => {
        state.checkoutProducts = []
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {
        state.loading = true,
        state.userData = null,
        state.error = null
    })
    .addCase(loginUser.fulfilled, (state, action) => {
        setDataInLocalStorage('user', action.payload)
        state.loading = false,
        state.userData = action.payload,
        state.error = null
    })
    .addCase(loginUser.rejected, (state, action) => {
        state.loading = false,
        state.userData =null,
        state.error = action.error
    })
    .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.userData = null,
        state.error = null
    })
    .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.userData = null,
        state.error = null
    })
    .addCase(registerUser.rejected, (state, action) => {
        state.loading = false,
        state.userData = null,
        state.error = action.payload.message
    })
  }
});

export const { clearUser, addProductTOCheckout, clearCheckout } = userSlice.actions;

export default userSlice.reducer;
