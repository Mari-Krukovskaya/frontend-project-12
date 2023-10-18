import { createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import getData from '../apiData/getChatData';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({ status: 'idle', error: null });

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getData.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getData.fulfilled, (state, action) => {
            const { channels } = action.payload;
            channelsAdapter.setAll(state, channels);
            state.status = 'idle';
            state.error = null;
        })
        .addCase(getData.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error;
        });
    },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
