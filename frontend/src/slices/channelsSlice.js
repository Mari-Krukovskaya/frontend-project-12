/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

export const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: 1,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addManyChannels: channelsAdapter.addMany,
    updateChannel: channelsAdapter.updateOne,
    deleteChannel: (state, { payload }) => {
      const id = payload;
      channelsAdapter.removeOne(state, payload);
      if (id === state.currentChannelId) {
        state.currentChannelId = 1;
      }
    },
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
