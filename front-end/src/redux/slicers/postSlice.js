import { createSlice } from '@reduxjs/toolkit'

export const postSlice = createSlice({
    name: 'postSlice',
    initialState: {
        show: false,
        visibility: false,
        imageUrl: null,
        hasMedia: false,
        showImageModal: false,
        showImageModalData: "",
        feeds: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase('SHOW_MODAL', (state, action) => {
            state.show = true
        })

        builder.addCase('HIDE_MODAL', (state, action) => {
            state.show = false
            state.visibility = true
        })

        builder.addCase('SHOW_IMAGE_MODAL', (state, action) => {
            state.showImageModal = true
            state.showImageModalData = action.payload
        })

        builder.addCase('HIDE_IMAGE_MODAL', (state, action) => {
            state.showImageModal = false
            state.showImageModalData = ""
        })

        builder.addCase('POST_IMAGE', (state, action) => {
            state.show = true
            state.imageUrl = action.payload
            state.visibility = false
            state.hasMedia = true
        })

        builder.addCase('FETCH_FEEDS', (state, action) => {
            state.feeds = action.payload
        })
    },
})

