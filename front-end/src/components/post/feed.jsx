import React, { useContext } from 'react'
import { faEllipsis, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Comments from "../comments/"
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'
import $ from 'jquery'
import AuthContextLogin from '../../context/AuthLoging'
import { Link } from 'react-router-dom'
import { Popover } from 'antd'

const Feeds = (props) => {
    const { currentUser } = useContext(AuthContextLogin)
    const { feeds } = props.state.posts
    const { id } = currentUser

    const handleDeletePost = async (postId) => {
        await axios.patch(`posts/${postId}`, { hidden: true }).then(() => {
            $(`#post-${postId}`).hide()
            $(`.ant-popover`).hide()

        }).catch((err) => {
            console.error("error:", err)
        })
    }

    return (
        feeds.map((post, key) => (
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
                        <div className='col-1 hover' style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', margin: 0 }} >
                            <Popover id={`popover-${post.id}`} placement="bottom" trigger="click" content={
                                <div style={{ width: 300 }}>
                                    {post.id === id ?
                                        <div onClick={() => handleDeletePost(post.id)} className="item ps-3 hover"
                                            style={{ display: "flex", alignItems: "center", height: 50 }}>
                                            <FontAwesomeIcon icon={faTrash} style={{ fontSize: 16, color: "#595C60" }} />
                                            <span className='ms-2'>Delete post</span>
                                        </div> :
                                        <div onClick={() => { }} className="item ps-3 hover"
                                            style={{ display: "flex", alignItems: "center", height: 50 }}>
                                            <FontAwesomeIcon icon={faEyeSlash} style={{ fontSize: 16, color: "#595C60" }} />
                                            <span className='ms-2'>Report</span>
                                        </div>
                                    }
                                </div>
                            }>
                                <button style={{ background: "transparent", border: "none" }} className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" >
                                    <FontAwesomeIcon id={`popover-${post.id}`} style={{ fontSize: 20, color: "#696969" }} icon={faEllipsis} />
                                </button>
                            </Popover>
                        </div>
                    </div>
                    <div>
                        <p style={{ marginTop: 15, paddingLeft: 15, fontSize: 16, marginBottom: 5 }}>{post.body}</p>
                    </div>

                </div>
                {post.imageUrl !== null && <div className="media">
                    <img style={{ width: "100%", borderRadius: 10 }} src={post.imageUrl} alt="" srcSet="" />
                </div>}
                <Comments post={post} />
            </div>
        ))
    )
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Feeds)
