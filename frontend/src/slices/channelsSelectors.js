import { createSelector } from '@reduxjs/toolkit';
import { channelsAdapter } from './channelsSlice.js';

export const selectors = channelsAdapter.getSelectors(
  (state) => state.channels,
);
export const selectCurrentId = (state) => state.channels.currentChannelId;

export const channelState = (state) => state.channels;

export const selectCurrentChannelId = createSelector(
  channelState,
  (channel) => channel.currentChannelId,
);

export const selectCurrentChannel = createSelector(
  selectors.selectAll,
  selectCurrentId,
  (channels, currentId) => channels.find((channel) => channel.id === currentId),
);
