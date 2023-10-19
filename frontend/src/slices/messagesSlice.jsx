import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import getData from '../apiData/getChatData';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState({ status: 'idle', error: null });

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        // eslint-disable-next-line no-param-reassign
        state.status = 'loading';
        // eslint-disable-next-line no-param-reassign
        state.error = null;
      })
      .addCase(getData.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.setAll(state, messages);
        // eslint-disable-next-line no-param-reassign
        state.status = 'idle';
        // eslint-disable-next-line no-param-reassign
        state.error = null;
      })
      .addCase(getData.rejected, (state, action) => {
        // eslint-disable-next-line no-param-reassign
        state.status = 'failed';
        // eslint-disable-next-line no-param-reassign
        state.error = action.error;
      });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
