/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

export const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: { id: 1, name: 'general', removeble: false },
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addManyChannels: channelsAdapter.addMany,
    updateChannel: channelsAdapter.updateOne,
    deleteChannel: (state, action) => {
      channelsAdapter.removeOne(state, action);
      if (state.currentChannelId === action.payload.id) {
        state.currentChannelId = { id: 1, name: 'general', removeble: false };
      }
    },
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
