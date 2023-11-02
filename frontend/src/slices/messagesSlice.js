/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import getData from '../apiData/getChatData';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState({ status: 'idle', error: null });

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addManyMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getData.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.setAll(state, messages);
        state.status = 'idle';
        state.error = null;
      })
      .addCase(getData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export const { addMessage, addManyMessages } = messagesSlice.actions;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
