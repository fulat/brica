import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchUsers, fetchCurrentUser } from "../apiFetchs"

const initialState = {
    users: [],
    user: {},
    error: '',
    loading: false
}

const userSlicer = createSlice({
    name: "users",
    initialState,
    extraReducers: {
        // fetch all users
        [fetchUsers.pending]: (state) => {
            state.loading = true
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.loading = false
            state.users = action.payload
            state.error = ''
        },
        [fetchUsers.rejected]: (state, action) => {
            state.loading = false
            state.users = []
            state.error = action.error.message
        },

        // fetch current user
        [fetchCurrentUser.fulfilled]: (state, action) => {
            state.loading = false
            state.user = action.payload
            state.error = ''
        },
        [fetchCurrentUser.rejected]: (state, action) => {
            state.loading = false
            state.user = {}
            state.error = action.error.message
        },
        [fetchCurrentUser.pending]: (state) => {
            state.loading = true
        }
    }
})



export default userSlicer.reducer




