import React, { createContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

const APIContext = createContext()

export const APIs = (props) => {
    const [feed, setFeeds] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            await axios.get(`/posts/followers/${2}`).then((res) => {
                let posts = []
                if (!res.data.data.error) {
                    res.data.data.forEach(post => {
                        posts.push(post.user.posts)
                    })
                }
                const feeds = sortDESC([].concat.apply([], posts))
                props.dispatch({ type: "FETCH_FEEDS", data: feeds })
                setFeeds([].concat.apply([], posts))
            })
        }
        fetchPosts()
    }, [])

    const sortDESC = (arr) => arr.sort((a, b) => b.id - a.id)

    return (
        <APIContext.Provider value={{ feed }}>
            <Outlet />
        </APIContext.Provider >
    )
}


const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(APIs)