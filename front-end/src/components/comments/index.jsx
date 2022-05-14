import React, { Component } from 'react'
import { faEllipsis, faHeart, faShare, faCamera, faCircleXmark, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import $ from "jquery"
import AuthContextLogin from '../../context/AuthLoging'
import { Link } from 'react-router-dom';
import Resizer from "react-image-file-resizer"
import ImageModals from '../post/ImageModals';
import Picker from 'emoji-picker-react';
import Reply from '../Replies/Reply';

class Commments extends Component {
    static contextType = AuthContextLogin
    constructor(props) {
        super(props);
        this.state = {
            reply: false,
            replyBody: "",
            initialQuantity: 2,
            comments: [],
            limit: 3,
            hasMedia: false,
            hasMediaReply: false,
            showImageModal: false,
            count: 0,
            body: "",
            file: null,
            fileReply: null
        }
    }

    handleShowReply = () => {
        this.setState({
            reply: !this.state.reply
        })
    }

    handleILikesIt = (likes) => {
        if (likes.length === 0) return false
        const { id } = this.context.currentUser
        const like = likes.find(key => key['user']["id"] === id)
        return like !== undefined
    }

    handleLikeComment = async (commentId) => {
        const { id } = this.context.currentUser
        await axios.post(`likes/comment/${commentId}`, { userId: id }).then((res) => {
            $(`#comment-like-${commentId}`).text(`${this.abbreviateNumber(res.data.likesCount)}`)
            $(`#comment-like-icon-${commentId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
        })
    }

    abbreviateNumber = (number) => {
        var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

        // what tier? (determines SI symbol)
        var tier = Math.log10(Math.abs(number)) / 3 | 0;

        // if zero, we don't need a suffix
        if (tier === 0) return number;

        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier];
        var scale = Math.pow(10, tier * 3);

        // scale the number
        var scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(1)[scaled.toFixed(1).length - 1] < 1 ? scaled.toFixed() + suffix : scaled.toFixed(1) + suffix;
    }

    sortDESC = (arr) => {
        const result = arr.sort((a, b) => { return b.id - a.id })
        return result
    }

    handleViewMore = () => {
        this.fetchComments(this.state.limit + 5)
    }

    fetchComments = async (limit) => {
        await axios.get(`/comments/post/${this.props.post.id}?limit=${limit}`).then((res) => {
            this.setState({
                comments: res.data.data.rows,
                count: res.data.data.count
            })
        })
    }

    handleOnCommentChange = (e, id) => {
        this.setState({
            body: e.target.value,
            showPost: e.target.value !== "" || this.state.hasMedia ? true : false
        })

        if (e.target.value !== "" || this.state.hasMedia) {
            $(`#button-post-${id}`).show()
        } else {
            $(`#button-post-${id}`).hide()
        }
    }

    handleCommediaMediaOnChange = (e, id) => {
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
                            this.setState({
                                hasMedia: true,
                                showPost: true,
                                file: e.target.files[0]
                            })
                            const output = document.getElementById('output-comment-media')
                            output.src = reader.result
                            $(`#button-post-${id}`).show()
                        }
                        reader.readAsDataURL(e.target.files[0])
                    },
                    "base64",
                    200,
                    200
                );
            } catch (err) {
                console.log(err);
            }
        }
    }

    handleCommediaMediaOnChangeReply = (e, id) => {
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
                            this.setState({
                                hasMediaReply: true,
                                showPost: true,
                                fileReply: e.target.files[0]
                            })
                            const output = document.getElementById('output-comment-media-reply')
                            output.src = reader.result
                            $(`#button-post-${id}`).show()
                        }
                        reader.readAsDataURL(e.target.files[0])
                    },
                    "base64",
                    200,
                    200
                );
            } catch (err) {
                console.log(err);
            }
        }
    }

    handleOnCommentPost = async (postId) => {
        const { body, hasMedia } = this.state
        const { id } = this.context.currentUser

        const formData = new FormData()
        formData.append("file", this.state.file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia) {
            const file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (file) {
                await axios.post("comments", { postId, userId: id, body: body === "" ? null : body, imageUrl: file.data.url, parentId: null }).then((res) => {
                    console.log(res.data);
                    this.setState({
                        body: "",
                        hasMedia: false
                    })
                    $(`#input-from-post-${postId}`).val("")
                    $(`#toggle-comment-from-${postId}`).show()
                    $(`#button-post-${postId}`).hide()
                })
            }
        } else {
            await axios.post("comments", { postId, userId: id, body, imageUrl: null, parentId: null }).then((res) => {
                this.setState({
                    body: "",
                    hasMedia: false
                })
                $(`#input-from-post-${postId}`).val("")
                $(`#toggle-comment-from-${postId}`).show()
                $(`#button-post-${postId}`).hide()
            })
        }
        this.fetchComments(this.state.limit < 1 ? 3 : this.state.limit)
    }

    onShowImageModal = (imageUrl) => {
        this.props.dispatch({ type: "SHOW_IMAGE_MODAL", data: imageUrl })
    }

    handleItLikes = (likes) => {
        if (likes.length === 0) return false
        const { id } = this.context.currentUser
        const like = likes.find(key => key['userId'] === id)
        return like !== undefined
    }

    handleOnClickLikes = async (postId, likes) => {
        await axios.post(`likes/${postId}`, { userId: this.context.currentUser.id }).then((res) => {
            $(`#post-like-icon-${postId}`).css("color", res.data.action === "create" ? "#0073DD" : "#CDCDCD")
            $(`#post-like-${postId}`).text(res.data.likesCount)
        })
    }

    handleShowComments = (id) => {
        $(`#toggle-comment-from-${id}`).toggle()
    }

    handlePostReply = async (commentId) => {
        const { id } = this.context.currentUser
        const { replyBody } = this.state

        if (replyBody !== "") {
            await axios.post(`/reply`, { commentId, userId: id, body: replyBody, imageUrl: null }).then((res) => {
                this.fetchComments(this.state.limit + 5)
                this.setState({
                    replyBody: "",
                    hasMediaReply: false
                })
            })
        }
    }

    handleOnChangeReply = async (e) => {
        this.setState({
            replyBody: e.target.value,
            hasMediaReply: e.target.value !== "" || this.state.hasMediaReply ? true : false
        })
    }

    componentDidMount() {
        this.fetchComments(1)
    }

    render() {
        const { reply, count, comments, hasMedia, hasMediaReply, replyBody } = this.state
        const { post } = this.props
        return (
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", height: 50 }}>
                    <div onClick={() => this.handleOnClickLikes(post.id, post.likes)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 20 }}>
                        <FontAwesomeIcon id={`post-like-icon-${post.id}`} style={{ fontSize: 20, color: this.handleItLikes(post.likes) ? "#0073DD" : "#CDCDCD" }} icon={faHeart} />
                        <b className='ps-2'>Like</b>
                        <span id={`post-like-${post.id}`} className='ps-1'>{post.likes.length > 0 && this.abbreviateNumber(post.likes.length)}</span>
                    </div>
                    <div onClick={() => this.handleShowComments(post.id)} className="live hover" style={{ display: "flex", alignItems: "center" }}>
                        <FontAwesomeIcon style={{ fontSize: 20, color: "#CDCDCD" }} icon={faComment} />
                        <span className='ps-2'><b>Comments</b> {post.comments.length > 0 && count}</span>
                    </div>
                    <div className="live hover" style={{ display: "flex", alignItems: "center", paddingRight: 20 }}>
                        <FontAwesomeIcon style={{ fontSize: 20, color: "#CDCDCD" }} icon={faShare} />
                        <span className='ps-2'><b>Share</b> 250</span>
                    </div>
                </div>
                <div id={`comment-post-${post.id}`}>
                    <div style={{ height: 35, display: "flex" }} className="comment-post-container mt-3">
                        <input id={`input-from-post-${post.id}`} onChange={(e) => this.handleOnCommentChange(e, post.id)} className="form-control ms-1" type="text" placeholder="Type a comment" aria-label="Post something" />
                        <label htmlFor="cameraFile">
                            <FontAwesomeIcon className='hover m-3' style={{ fontSize: 18, color: "rgba(000, 000, 000, 0.3)" }} icon={faCamera} />
                            <input onChange={(e) => this.handleCommediaMediaOnChange(e, post.id)} style={{ display: "none" }} type="file" name="" id="cameraFile" />
                        </label>
                        <button id={`button-post-${post.id}`} style={{ display: "none" }} onClick={() => this.handleOnCommentPost(post.id)} className='hover comment-post'>Post</button>
                    </div>
                    {hasMedia &&
                        <div className='mt-2 p-2' style={{ background: "#ECECEC", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <img alt='output' id='output-comment-media' src='' style={{ width: 100, borderRadius: 10 }} />
                            </div>
                            <div onClick={() => this.handleCloseImage(post.id)} style={{ display: "flex", justifyContent: "center" }} className="close-img pt-1 hover col-1">
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </div>
                        </div>
                    }
                </div>
                {this.sortDESC(comments).map((comment, key) => (
                    <section key={key} className='Comments mt-3 ps-2'>
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
                                    <FontAwesomeIcon style={{ fontSize: 18, color: "#666666" }} icon={faEllipsis} />
                                </div>
                                <div style={{ display: "flex" }}>
                                    <div className='col-11 ps-2 pb-3'>
                                        <span>{comment.body}</span>
                                    </div>
                                </div>
                                {comment.imageUrl !== null && <img onClick={() => this.onShowImageModal(comment.imageUrl)} className='p-2 hover' style={{ width: "100%", paddingRight: 7, borderRadius: 15 }} src={comment.imageUrl} alt="" srcSet="" />}
                                <div style={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
                                    <div onClick={() => this.handleLikeComment(comment.id)} className="live hover" style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
                                        <FontAwesomeIcon id={`comment-like-icon-${comment.id}`} style={{ fontSize: 14, color: this.handleILikesIt(comment.commentLikes) ? "#0073DD" : "#CDCDCD" }} icon={faHeart} />
                                        <span style={{ fontSize: 12 }} className='ps-2'>
                                            <b>Like </b>
                                            <span id={`comment-like-${comment.id}`}>{comment.commentLikes.length}</span>
                                        </span>
                                    </div>
                                    <div onClick={this.handleShowReply} className="live hover ms-3" style={{ display: "flex", alignItems: "center" }}>
                                        <FontAwesomeIcon style={{ fontSize: 14, color: "#CDCDCD" }} icon={faShare} />
                                        <span style={{ fontSize: 12 }} className='ps-2'><b>Reply</b> 250</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {reply &&
                            <div className='mt-2' style={{ position: "relative", left: 7, display: "flex", alignItems: "center" }}>
                                <div className='col-2' style={{ display: "flex", justifyContent: "flex-end", paddingRight: 10 }}>
                                    <img alt="crypto" className='col-2' style={{ width: 30, height: 30, borderRadius: 100 }}
                                        src={this.context.currentUser.image}
                                    />
                                </div>
                                <div className="col-9" style={{ background: "#ECECEC", borderRadius: 25, display: "flex", alignItems: "center" }}>
                                    <input value={replyBody} id={`input-from-post-${post.id}`} onChange={this.handleOnChangeReply} className="form-control ms-1" type="text" placeholder="Type a comment" aria-label="Post something" />
                                    <label htmlFor="cameraFile" style={{ marginRight: 15 }}>
                                        <FontAwesomeIcon className='hover' style={{ fontSize: 18, color: "rgba(000, 000, 000, 0.3)" }} icon={faCamera} />
                                        <input onChange={(e) => this.handleCommediaMediaOnChangeReply(e, post.id)} style={{ display: "none" }} type="file" name="" id="cameraFile" />
                                    </label>
                                    {hasMediaReply && <button id={`button-reply-${post.id}`} style={{}} onClick={() => this.handlePostReply(comment.id)} className='hover comment-post'>Post</button>}
                                </div>
                            </div>
                        }
                        <Reply comment={comment} replies={comment.replies} />
                    </section >
                ))}
                {count > 1 &&
                    <div onClick={this.handleViewMore} className='ps-3 pt-2'>
                        <button style={{ background: "none", border: "none", color: "#008DF8" }}>View More</button>
                    </div>
                }
                <ImageModals />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Commments)
