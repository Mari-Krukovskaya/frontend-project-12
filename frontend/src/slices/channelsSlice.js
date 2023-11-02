/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import getData from '../apiData/getChatData';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  status: 'idle',
  error: null,
  currentChannelId: 1,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addManyChannels: channelsAdapter.addMany,
    updateChannel: channelsAdapter.updateOne,
    deleteChannel: ((state, action) => {
      const id = action.payload;
      channelsAdapter.removeOne(state, id);
      if (id === state.currentChannelId) {
        state.currentChannelId = 1;
      }
    }),
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getData.fulfilled, (state, action) => {
        const { channels, currentChannelId } = action.payload;
        channelsAdapter.setAll(state, channels);
        state.currentChannelId = currentChannelId;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(getData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export const {
  addChannel,
  addManyChannels,
  updateChannel,
  deleteChannel,
  setCurrentChannelId,
} = channelsSlice.actions;
export const selectorsChannels = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
