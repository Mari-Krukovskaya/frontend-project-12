import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import getData from '../apiData/getChatData';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    deleteChannel: ((state, action) => {
      const id = action.payload;
      channelsAdapter.removeOne(state, id);
      // eslint-disable-next-line no-param-reassign
      if (id === state.currentChannelId) {
        // eslint-disable-next-line no-param-reassign
        state.currentChannelId = 1;
      }
    }),
    setCurrentChannelId: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.currentChannelId = action.payload;
    },
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
        const { channels, currentChannelId } = action.payload;
        channelsAdapter.setAll(state, channels);
        // eslint-disable-next-line no-param-reassign
        state.currentChannelId = currentChannelId;

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

export const {
  addChannel,
  updateChannel,
  deleteChannel,
  setCurrentChannelId,
} = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
