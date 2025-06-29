// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userStore'
import productReducer from './productStore'

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
