import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../routes/api.js';

const getData = createAsyncThunk(
  'getData',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(api.dataPath(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        return rejectWithValue(error.response.status);
      }
      throw error;
    }
  },
);
export default getData;
