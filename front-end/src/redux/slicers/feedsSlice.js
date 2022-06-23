import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFeeds, postFeed } from "../apiFetchs"

const initialState = {
    feeds: [],
    error: '',
    loading: false
}

const feedsSlice = createSlice({
    name: "feeds",
    initialState,
    extraReducers: {
        // fetch all feeds
        [fetchFeeds.pending]: (state) => {
            state.loading = true
        },
        [fetchFeeds.fulfilled]: (state, action) => {
            state.loading = false
            state.feeds = action.payload
            state.error = ''
        },
        [fetchFeeds.rejected]: (state, action) => {
            state.loading = false
            state.feeds = []
            state.error = action.error.message
        },

        // post feed
        [postFeed.pending]: (state, action) => {
            state.loading = true
        },
        [postFeed.fulfilled]: (state, action) => {
            state.loading = false
            state.feeds = action.payload
            state.error = ''
            window.location.reload()
        },
        [postFeed.rejected]: (state, action) => {
            state.loading = false
            state.feeds = []
            state.error = action.error.message
        }
    }
})



export default feedsSlice.reducer




