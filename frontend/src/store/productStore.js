import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makeAuthenticatedRequest } from '../service/axiosService';

export const createProduct = createAsyncThunk('product/create', async (formData, { rejectWithValue }) => {
  try {
    const response = await makeAuthenticatedRequest('api/product/create', 'POST', formData);
    return response;
  } catch (error) {
    return rejectWithValue({ message: error });
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    loading: false,
    productData: {},
    status: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.productData = null;
        state.error = null;
        state.message = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = action.payload;
        state.error = null;
        state.status = "Success";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.productData = null;
        state.error = action.error;
        state.status = "Error";
      });
  },
});

export default productSlice.reducer;