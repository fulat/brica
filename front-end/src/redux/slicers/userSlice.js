import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
	name: 'userSlice',
	initialState: {
		user: {}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase('GET_CURRENT_USER', (state, action) => {
			state.user = action.data
		})
	},
})

