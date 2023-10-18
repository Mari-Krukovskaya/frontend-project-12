import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../routes/api.js';

const getData = createAsyncThunk('getData', async (token) => {
  try {
    const { data } = await axios.get(api.dataPath(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw new Error('Ошибка при получении данных');
  }
});

export default getData;
