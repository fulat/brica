import React, { useContext, useEffect, useState } from 'react'
import { faCopy, faEarthAmerica, faEllipsis, faEyeSlash, faFlag, faLink, faMessage, faTrashCan, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Comments from "../comments/"
import { connect, useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import $ from 'jquery'
import AuthContextLogin from '../../context/AuthLoging'
import { Link } from 'react-router-dom'
import { Popover } from 'antd'
import { fetchFeeds, deleteFeed, unfallowUser } from '../../redux/apiFetchs'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Feeds = (props) => {
    const { currentUser } = useContext(AuthContextLogin)
    const state = useSelector(state => state.feedsSlice)
    const dispatch = useDispatch()


    const handleDeletePost = (postId) => {
        dispatch(deleteFeed(postId))
        $(`#post-${postId}`).hide()
        $(`.ant-popover`).hide()
    }

    const handleUnfollow = (id) => {
        dispatch(unfallowUser(currentUser.id, id))
    }


    useEffect(() => {
        dispatch(fetchFeeds(currentUser.id))
    }, [])

    return (
        state.feeds.map((post, key) => (
            <div key={key} id={`post-${post.id}`} className='Feed mb-3 p-3' style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                    <div className='col-1' style={{ display: "flex", width: "100%" }}>
                        <div className='col-11' style={{ display: "flex" }}>
                            <img alt="crypto" className='col-3 t-2' style={{ width: 42, height: 42, borderRadius: 100 }} src={post?.user.image} />
                            <div className='ps-3 col-12' style={{ display: "flex", flexDirection: "column", }}>
                                <Link style={{ color: "black" }} className='hover-with-underline' to={`/u/${post.user.uuid}`}>
                                    <b>{post.user.firstName} {post.user.lastName}</b>
                                </Link>
                                <span style={{ fontSize: 12 }}>{moment(post.createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <div className='col-1' style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', margin: 0 }} >
                            <Popover id={`popover-${post.id}`} placement="bottom" trigger="click" content={
                                <div style={{ width: 300 }}>
                                    {post.userId === currentUser.id ?
                                        <div>
                                            <div onClick={() => handleDeletePost(post.id)} className="item ps-3"
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: 14, color: "#595C60" }} />
                                                <span className='ms-2'>Delete post</span>
                                            </div>
                                            <div onClick={() => { }} className="item ps-3"
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon icon={faEarthAmerica} style={{ fontSize: 14, color: "#595C60" }} />
                                                <span className='ms-2'>Edit Privacy</span>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <CopyToClipboard text={`${window.location}brayhandeaza/post/${post.id}`}>
                                                <div className="item ps-3"
                                                    style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                    <FontAwesomeIcon icon={faLink} style={{ fontSize: 14, color: "#595C60" }} />
                                                    <span className='ms-2'>Copy link to post</span>
                                                </div>
                                            </CopyToClipboard>
                                            <div onClick={() => handleUnfollow(post.user.id)} className="item ps-3"
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon icon={faUserXmark} style={{ fontSize: 14, color: "#595C60" }} />
                                                <span className='ms-2'>Unfollow <b>{post.user.firstName} {post.user.lastName}</b></span>
                                            </div>
                                            <div onClick={() => { }} className="item ps-3"
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon icon={faMessage} style={{ fontSize: 14, color: "#595C60" }} />
                                                <span className='ms-2'>Message <b>{post.user.firstName} {post.user.lastName}</b></span>
                                            </div>
                                            <div onClick={() => { }} className="item ps-3"
                                                style={{ display: "flex", alignItems: "center", height: 50 }}>
                                                <FontAwesomeIcon icon={faFlag} style={{ fontSize: 14, color: "#595C60" }} />
                                                <span className='ms-2'>Is this post about crypto?</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }>
                                <button style={{ background: "transparent", border: "none" }} className="dropdown-toggle circle-hover" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" >
                                    <FontAwesomeIcon id={`popover-${post.id}`} style={{ fontSize: 20, color: "#696969" }} icon={faEllipsis} />
                                </button>
                            </Popover>
                        </div>

                    </div>
                    <div>
                        <p style={{ marginTop: 15, paddingLeft: 15, fontSize: 16, marginBottom: 5 }}>{post.body}</p>
                    </div>
                </div >
                {
                    post.imageUrl !== null &&
                    <div className="media">
                        <img style={{ width: "100%", borderRadius: 10 }} src={post.imageUrl} />
                    </div>
                }
                < Comments post={post} />
            </div >
        ))
    )
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Feeds)
