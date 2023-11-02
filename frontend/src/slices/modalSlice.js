/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  type: null,
  channelId: null,
};

const modalsSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    isOpen: (state, action) => {
      const { type, channelId = null } = action.payload;
      return {
        ...state,
        show: true,
        type,
        channelId,
      };
    },
    isClose: () => initialState,
  },
});

export const { isOpen, isClose } = modalsSlice.actions;
export default modalsSlice.reducer;