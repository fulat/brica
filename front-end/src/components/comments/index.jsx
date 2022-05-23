import React, { Component, useContext, useEffect, useState } from 'react'
import { faEllipsis, faHeart, faShare, faCamera, faCircleXmark, faComment, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import $ from "jquery"
import AuthContextLogin from '../../context/AuthLoging'
import { Link } from 'react-router-dom'
import Resizer from "react-image-file-resizer"
import ImageModals from '../post/ImageModals'
import Picker from 'emoji-picker-react'
import Reply from '../Replies/Reply'
import { Popover } from 'antd'


const Comments = (props) => {
    const [reply, setReply] = useState(false)
    const [replyBody, setReplyBody] = useState("")
    const [initialQuantity, setInitialQuantity] = useState(1)
    const [comments, setComments] = useState([])
    const [limit, setLimit] = useState(1)
    const [hasMedia, setHasMedia] = useState(false)
    const [hasMediaReply, setHasMediaReply] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [showPost, setShowPost] = useState(false)
    const [count, setCount] = useState(0)
    const [body, setBody] = useState("")
    const [file, setFile] = useState(null)
    const [fileReply, setFileReply] = useState(null)
    const { currentUser } = useContext(AuthContextLogin)


    const handleShowReply = (id) => {
        $(`#input-reply-${id}`).toggle()
        setReply(!reply)
    }

    const handleILikesIt = (likes) => {
        if (likes.length === 0) return false
        const { id } = currentUser
        const like = likes.find(key => key['user']["id"] === id)
        return like !== undefined
    }

    const handleLikeComment = async (commentId) => {
        const { id } = currentUser
        await axios.post(`likes/comment/${commentId}`, { userId: id }).then((res) => {
            $(`#comment-like-${commentId}`).text(`${abbreviateNumber(res.data.likesCount)}`)
            $(`#comment-like-icon-${commentId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
        })
    }

    const abbreviateNumber = (number) => {
        const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]
        const tier = Math.log10(Math.abs(number)) / 3 | 0

        if (tier === 0) return number

        const suffix = SI_SYMBOL[tier]
        const scale = Math.pow(10, tier * 3)
        const scaled = number / scale

        return scaled.toFixed(1)[scaled.toFixed(1).length - 1] < 1 ? scaled.toFixed() + suffix : scaled.toFixed(1) + suffix
    }

    const sortDESC = (arr) => {
        const result = arr.sort((a, b) => { return b.id - a.id })
        return result
    }

    const handleViewMore = () => {
        fetchComments(limit + 3)
        setLimit(limit + 5)
    }

    const handleOnCommentChange = (e, id) => {
        setBody(e.target.value)
        setShowPost(e.target.value !== "" || hasMedia ? true : false)


        if (e.target.value !== "" || hasMedia) {
            $(`#button-post-${id}`).show()
        } else {
            $(`#button-post-${id}`).hide()
        }
    }

    const handleCommediaMediaOnChange = (e, id) => {
        if (e.target.files[0]) {
            try {
                Resizer.imageFileResizer(
                    e.target.files[0],
                    500,
                    300,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        const reader = new FileReader()
                        reader.onload = () => {
                            setHasMedia(true)
                            setShowPost(true)
                            setFile(e.target.files[0])

                            const output = document.getElementById('output-comment-media')
                            output.src = reader.result
                            $(`#button-post-${id}`).show()
                        }
                        reader.readAsDataURL(e.target.files[0])
                    },
                    "base64",
                    200,
                    200
                )
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleCommediaMediaOnChangeReply = (e, id) => {
        if (e.target.files[0]) {
            try {
                Resizer.imageFileResizer(
                    e.target.files[0],
                    500,
                    300,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        const reader = new FileReader()
                        reader.onload = () => {
                            setHasMediaReply(true)
                            setShowPost(true)
                            setFileReply(e.target.files[0])

                            const output = document.getElementById('output-comment-media-reply')
                            output.src = reader.result
                            $(`#button-post-${id}`).show()
                        }
                        reader.readAsDataURL(e.target.files[0])
                    },
                    "base64",
                    200,
                    200
                )
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleOnCommentPost = async (postId) => {
        const { id } = currentUser

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            const file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (file) {
                await axios.post("comments", { postId, userId: id, body: body === "" ? null : body, imageUrl: file.data.url, parentId: null }).then((res) => {
                    setBody("")
                    setHasMedia(false)

                    $(`#input-from-post-${postId}`).val("")
                    $(`#toggle-comment-from-${postId}`).show()
                    $(`#button-post-${postId}`).hide()
                })
            }
        } else {
            await axios.post("comments", { postId, userId: id, body, imageUrl: null, parentId: null }).then((res) => {
                setBody("")
                setHasMedia(false)

                $(`#input-from-post-${postId}`).val("")
                $(`#toggle-comment-from-${postId}`).show()
                $(`#button-post-${postId}`).hide()
            })
        }
        fetchComments(limit < 1 ? 3 : limit)
    }

    const onShowImageModal = (imageUrl) => {
        props.dispatch({ type: "SHOW_IMAGE_MODAL", data: imageUrl })
    }

    const handleItLikes = (likes) => {
        if (likes.length === 0) return false
        const { id } = currentUser
        const like = likes.find(key => key['userId'] === id)
        return like !== undefined
    }

    const handleOnClickLikes = async (postId, likes) => {
        await axios.post(`likes/${postId}`, { userId: currentUser.id }).then((res) => {
            $(`#post-like-icon-${postId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
            $(`#post-like-${postId}`).text(res.data.likesCount)
        })
    }

    const handleShowComments = (id) => {
        $(`#toggle-comment-from-${id}`).toggle()
    }

    const handlePostReply = async (commentId) => {
        const { id } = currentUser

        if (replyBody !== "") {
            await axios.post(`/reply`, { commentId, userId: id, body: replyBody, imageUrl: null }).then((res) => {
                fetchComments(limit + 5)
                $(`#input-reply-${commentId}`).hide()

                setBody("")
                setHasMediaReply(false)
            })
        }
    }

    const handleOnChangeReply = async (e) => {
        setBody(e.target.value)
        setHasMediaReply(e.target.value !== "" || hasMediaReply ? true : false)
    }

    const fetchComments = async (limit) => {
        await axios.get(`/comments/post/${props.post.id}?limit=${limit}`).then((res) => {
            if (!res.data.error) {
                setComments(res.data.data?.rows)
                setCount(res.data.data?.count)
            }
        })
    }

    const handleDeleteComment = async (id) => {
        await axios.patch(`/comments/${id}`, { hidden: true }).then((res) => {
            $(`.ant-popover`).hide()
            $(`#comment-${id}`).hide()

            setCount(res.data.count)

        }).catch((err) => {
            console.error("error:", err)
        })
    }

    const handleCloseImage = (id) => {

    }

    useEffect(() => {
        fetchComments(1)
    }, [])

    const { post } = props

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", height: 50 }}>
                <div onClick={() => handleOnClickLikes(post.id, post.likes)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 20 }}>
                    <FontAwesomeIcon id={`post-like-icon-${post.id}`} style={{ fontSize: 20, color: handleItLikes(post.likes) ? "#0073DD" : "#CDCDCD" }} icon={faHeart} />
                    <b className='ps-2'>Like</b>
                    <span id={`post-like-${post.id}`} className='ps-1'>{post.likes.length > 0 && abbreviateNumber(post.likes.length)}</span>
                </div>
                <div onClick={() => handleShowComments(post.id)} className="live hover" style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon style={{ fontSize: 20, color: "#CDCDCD" }} icon={faComment} />
                    <span className='ps-2'><b>Comments</b> {count}</span>
                </div>
                <div className="live hover" style={{ display: "flex", alignItems: "center", paddingRight: 20 }}>
                    <FontAwesomeIcon style={{ fontSize: 20, color: "#CDCDCD" }} icon={faShare} />
                    <span className='ps-2'><b>Share</b> 250</span>
                </div>
            </div>
            <div id={`comment-post-${post.id}`}>
                <div style={{ height: 35, display: "flex" }} className="comment-post-container mt-3">
                    <input id={`input-from-post-${post.id}`} onChange={(e) => handleOnCommentChange(e, post.id)} className="form-control ms-1" type="text" placeholder="Type a comment" aria-label="Post something" />
                    <label htmlFor="cameraFile">
                        <FontAwesomeIcon className='hover m-3' style={{ fontSize: 18, color: "rgba(000, 000, 000, 0.3)" }} icon={faCamera} />
                        <input onChange={(e) => handleCommediaMediaOnChange(e, post.id)} style={{ display: "none" }} type="file" name="" id="cameraFile" />
                    </label>
                    <button id={`button-post-${post.id}`} style={{ display: "none" }} onClick={() => handleOnCommentPost(post.id)} className='hover comment-post'>Post</button>
                </div>
                {hasMedia &&
                    <div className='mt-2 p-2' style={{ background: "#ECECEC", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <img alt='output' id='output-comment-media' src='' style={{ width: 100, borderRadius: 10 }} />
                        </div>
                        <div onClick={() => handleCloseImage(post.id)} style={{ display: "flex", justifyContent: "center" }} className="close-img pt-1 hover col-1">
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </div>
                    </div>
                }
            </div>
            {sortDESC(comments) && sortDESC(comments).map((comment, key) => (
                <section key={key} id={`comment-${comment.id}`} className='Comments mt-3 ps-2'>
                    <div style={{ display: "flex" }}>
                        <Link to={`/u/${comment.user.uuid}`}>
                            <img alt="crypto" className='col-3 hover' style={{ width: 40, height: 40, borderRadius: 100, marginRight: 10 }} src={comment.user.image} />
                        </Link>
                        <div className="commnt-body" style={{ width: "100%" }}>
                            <div className='ps-1 col-12' style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <Link className='hover-with-underline' to={`/u/${comment.user.uuid}`} style={{ color: "black" }}>
                                        <b>{comment.user.firstName} {comment.user.lastName}</b>
                                    </Link>
                                    <span className='time ms-2' style={{ fontSize: 12 }}>{moment(comment.createdAt).fromNow()}</span>
                                </div>
                                <Popover id={`popover-${post.id}`} placement="bottom" trigger="click" content={
                                    <div style={{ width: 300 }}>
                                        <div onClick={() => handleDeleteComment(comment.id)} className="item ps-3 hover"
                                            style={{ display: "flex", alignItems: "center", height: 50 }}>
                                            <FontAwesomeIcon icon={faEyeSlash} style={{ fontSize: 16, color: "#595C60" }} />
                                            <span className='ms-2'>Delete post</span>
                                        </div>
                                    </div>
                                }>
                                    <button style={{ background: "transparent", border: "none" }} className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" >
                                        <FontAwesomeIcon id={`popover-${post.id}`} style={{ fontSize: 20, color: "#696969" }} icon={faEllipsis} />
                                    </button>
                                </Popover>
                            </div>
                            <div style={{ display: "flex" }}>
                                <div className='col-11 ps-2 pb-3'>
                                    <span>{comment.body}</span>
                                </div>
                            </div>
                            {comment.imageUrl !== null && <img onClick={() => onShowImageModal(comment.imageUrl)} className='p-2 hover' style={{ width: "100%", paddingRight: 7, borderRadius: 15 }} src={comment.imageUrl} alt="" srcSet="" />}
                            <div style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                                <div onClick={() => handleLikeComment(comment.id)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                                    <FontAwesomeIcon id={`comment-like-icon-${comment.id}`} style={{ fontSize: 14, color: handleILikesIt(comment.commentLikes) ? "#0073DD" : "#CDCDCD" }} icon={faHeart} />
                                    <span style={{ fontSize: 12 }} className='ps-2'>
                                        <b>Like </b>
                                        <span id={`comment-like-${comment.id}`}>{comment.commentLikes.length}</span>
                                    </span>
                                </div>
                                <div onClick={() => handleShowReply(comment.id)} className="live hover ms-3" style={{ display: "flex", alignItems: "center" }}>
                                    <FontAwesomeIcon style={{ fontSize: 14, color: "#CDCDCD" }} icon={faShare} />
                                    <span style={{ fontSize: 12 }} className='ps-2'><b>Reply</b> 250</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id={`input-reply-${comment.id}`} style={{ display: "none" }}>
                        <div className='mt-2' style={{ position: "relative", left: 7, display: "flex", alignItems: "center" }}>
                            <div className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
                                <img alt="crypto" className='col-2' style={{ width: 30, height: 30, borderRadius: 100 }}
                                    src={currentUser.image}
                                />
                            </div>
                            <div className="col-9" style={{ background: "#ECECEC", borderRadius: 25, display: "flex", alignItems: "center" }}>
                                <input value={replyBody} id={`input-from-post-${reply.id}`} onChange={handleOnChangeReply} className="form-control ms-1" type="text" placeholder="Type a comment" aria-label="Post something" />
                                <label htmlFor="cameraFile" style={{ marginRight: 15 }}>
                                    <FontAwesomeIcon className='hover' style={{ fontSize: 18, color: "rgba(000, 000, 000, 0.3)" }} icon={faCamera} />
                                    <input onChange={(e) => handleCommediaMediaOnChangeReply(e, reply.id)} style={{ display: "none" }} type="file" name="" id="cameraFile" />
                                </label>
                                {hasMediaReply && <button id={`button-reply-${reply.id}`} style={{}} onClick={() => handlePostReply(comment.id)} className='hover comment-post'>Post</button>}
                            </div>
                        </div>
                    </div>
                    <Reply comment={comment} replies={comment.replies} />
                </section >
            ))}
            {(count > 1 && limit < count) &&
                <div onClick={handleViewMore} className='ps-3 pt-2'>
                    <button style={{ background: "none", border: "none", color: "#008DF8" }}>View More</button>
                </div>
            }
            <ImageModals />
        </div>
    )

}




const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Comments)
