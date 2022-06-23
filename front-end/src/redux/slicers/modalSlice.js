import { createSlice } from '@reduxjs/toolkit'


const modalSlice = createSlice({
    name: "modal",
    initialState: {
        show: false,
        commentMedia: false,
        payload: null
    },
    reducers: {
        show: (state) => {
            return { ...state, show: true }
        },
        hide: (state) => {
            return { ...state, show: false }
        },

        showCommentMedia: (state, action) => {
            return { ...state, commentMedia: true, payload: action.payload }
        },
        hideCommentMedia: (state) => {
            return { ...state, commentMedia: false }
        }
    }
})

export const { show, hide, showCommentMedia, hideCommentMedia } = modalSlice.actions

export default modalSlice.reducer




