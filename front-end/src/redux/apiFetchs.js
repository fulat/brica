import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"


// fetch all user
export const fetchUsers = createAsyncThunk("user/fetchUsers", () => {
    return axios.get(`users`).then((res) => res.data)
})

// fetch all user
export const fetchCurrentUser = createAsyncThunk("user/fetchCurrentUser", (uuid) => {
    return axios.get(`users/f/${uuid}`).then((res) => res.data)
})




// ----------------------------- Feed -----------------------------

// fetch feeds
export const fetchFeeds = createAsyncThunk("feed/fetchFeeds", (id) => {
    return axios.get(`posts/followers/${id}`).then((res) => {
        const sortDESC = (arr) => arr.sort((a, b) => b.id - a.id)
        let posts = []
        res.data.data.forEach(post => {
            posts.push(post.user.posts)
        })
        return sortDESC([].concat.apply([], posts))
    })
})

// post feed
export const postFeed = createAsyncThunk("feed/postFeed", ({ imageUrl, body, privacy, uuid, tokenCookie }) => {
    return axios.post(`posts/${uuid}`, {
        imageUrl, body, privacy
    }, {
        headers: {
            authorization: tokenCookie
        }
    }).then((res) => res.data)
})


// delete feed
export const deleteFeed = createAsyncThunk("feed/deleteFeed", (id) => {
    return axios.patch(`posts/${id}`, { hidden: true }).then((res) => res.data)
})


// unfallow user
export const unfallowUser = createAsyncThunk("feed/deleteFeed", (userId, followingId) => {
    return axios.patch(`${userId}/following/${followingId}`, { hidden: true }).then((res) => res.data)
})