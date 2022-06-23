import { faCamera, faEllipsis, faHeart, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import moment from 'moment'
import React, { Component, useContext, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import AuthContextLogin from '../../context/AuthLoging'
import { showCommentMedia } from '../../redux/slicers/modalSlice'


const Reply = (props) => {
    const [replies, setReplies] = useState([])
    const { currentUser } = useContext(AuthContextLogin)
    const dispatch = useDispatch()

    const onShowImageModal = (imageUrl) => {
        // // props.dispatch({ type: "SHOW_IMAGE_MODAL", payload: imageUrl })
        // dispatch(showCommentMedia(imageUrl))
    }

    const sortDESC = (arr) => {
        const result = arr.sort((a, b) => { return b.id - a.id })
        return result
    }

    const handleItLikes = (likes) => {
        if (likes.length === 0) return false
        const { id } = currentUser
        const like = likes.find(key => key['userId'] === id)

        if (like !== undefined) {
            return true
        }
        return false
    }

    const handleLikereply = async (replyId, key) => {
        const { id } = currentUser
        await axios.post(`/likes/reply/${replyId}`, {
            userId: id
        }).then((res) => {
            fetchReply()
        })
    }

    const fetchReply = async () => {
        const { comment } = props
        await axios.get(`/reply/comment/${comment.id}`).then((res) => {
            if (!res.data.error) {
                setReplies(res.data.data)
            }
        })
    }

    useEffect(() => {
        fetchReply()
    })

    return (
        sortDESC(replies).map((reply, key) => (
            <div key={key} className='mt-2' style={{ display: "flex", paddingLeft: 20 }}>
                <Link className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 20 }} to={`/u/${reply.user.uuid}`}>
                    <img alt="crypto" className='col-3 mt-2' style={{ width: 30, height: 30, borderRadius: 100, background: "gray" }}
                        src={reply.user.image}
                    />
                </Link>
                <div className='col-10 mt-1 reply' style={{ display: "flex", background: "#ECECEC", flexDirection: "column" }}>
                    <div className='ps-1 col-12' style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <Link className='hover-with-underline' to={`/u/${reply.user.uuid}`} style={{ color: "black" }}>
                                <b>{reply.user.firstName} {reply.user.lastName}</b>
                            </Link>
                            <span className='time ms-2' style={{ fontSize: 12 }}>{moment(reply.createdAt).fromNow()}</span>
                        </div>
                        <FontAwesomeIcon style={{ fontSize: 18, color: "#666666", marginRight: 5 }} icon={faEllipsis} />
                    </div>
                    <div className='col-11 ps-2 pb-3'>
                        <span>{reply.body}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                        <div onClick={() => handleLikereply(reply.id, key)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                            <FontAwesomeIcon id={`reply-like-icon-${reply.id}`} style={{ fontSize: 14, color: handleItLikes(reply.replyLikes) ? "#0073DD" : "#CDCDCD" }} icon={faHeart} />
                            <span style={{ fontSize: 12 }} className='ps-2'>
                                <b>Like </b>
                                <span id={`reply-like-${reply.id}`}>{reply.replyLikes.length}</span>
                            </span>
                        </div>
                        <div className="live hover ms-3" style={{ display: "flex", alignItems: "center" }}>
                            <FontAwesomeIcon style={{ fontSize: 14, color: "#CDCDCD" }} icon={faShare} />
                            <span style={{ fontSize: 12 }} className='ps-2'><b>Reply</b> 250</span>
                        </div>
                    </div>
                </div>
                {reply.imageUrl !== null &&
                    <img onClick={() => onShowImageModal(reply.imageUrl)} className='p-2 hover' style={{ width: "100%", paddingRight: 7, borderRadius: 15 }} src={reply.imageUrl} alt="" srcSet="" />
                }
            </div>
        ))
    )
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Reply)