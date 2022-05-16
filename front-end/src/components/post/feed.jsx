import React, { Component } from 'react'
import { faEllipsis, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Comments from "../comments/"
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import Cookies from 'universal-cookie'
import $ from 'jquery'
import Resizer from "react-image-file-resizer"
import AuthContextLogin from '../../context/AuthLoging'
import { Link } from 'react-router-dom';
import { Popover } from 'antd';


class Feed extends Component {
    static contextType = AuthContextLogin
    constructor(props) {
        super(props);
        this.state = {
            showComment: false,
            showPost: false,
            hasMedia: false,
            showPopover: false,
            visible: false,
            file: null,
            posts: [],
            likes: [],
            currentUser: {},
            body: "",
            to: 5
        }
        this.cookies = new Cookies()
        this.tokenCookie = this.cookies.get("ss_us_tnk")
        this.lStorage = JSON.parse(localStorage.getItem("Parse/M7GZzjiito65lVhn26wVeBXJXSdXKxq0QGhjEfUA/currentUser"))
        this.inputRef = React.createRef()
    }

    sortDESC = (arr) => arr.sort((a, b) => b.id - a.id)

    handleILikesIt = (likes) => {
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
    }

    handleCloseImage = (id) => {
        $(`#output-comment-media`).attr("src", "")
        this.setState({
            hasMedia: false,
            showPost: this.state.body === "" ? false : true,
        })
        $(`#button-post-${id}`).hide()
    }

    handleDeleteComment = async (postId) => {
        // await axios.delete(`posts/${postId}`).then((rs) => {
            $(`#post-${postId}`).hide()
            $(`.ant-popover`).hide()
        // }).catch((err) => {
        //     console.error("error:", err)
        // })
    }

    handleComediaMedia = (e, id) => {

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

    abbreviateNumber = (number) => {
        var SI_SYMBOL = ["", "k", "M", "B", "T", "Q"];

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

    handleShowComments = (id) => {
        $(`#toggle-comment-from-${id}`).toggle()
    }

    PopoverComponent = (post) => {
        return (
            <section className='Popover' style={{ width: 300, borderRadius: 15 }}>
                <div onClick={() => this.handleDeleteComment(post.id)} className="item ps-2 hover mt-2" style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: 20, color: "#595C60" }} />
                    <b className='ms-2'>Delete post</b>
                </div>
                <div className="item ps-2 hover mt-2" style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faEyeSlash} style={{ fontSize: 20, color: "#595C60" }} />
                    <b className='ms-2'>Delete post</b>
                </div>
                <div className="item ps-2 hover mt-2" style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: 20, color: "#595C60" }} />
                    <b className='ms-2'>Delete post</b>
                </div>
            </section>
        )
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = visible => {
        this.setState({ visible });
        console.log(visible)
    }

    render() {
        const { feeds } = this.props.state.posts
        console.log(feeds)
        return (
            feeds.map((post, key) => (
                <div key={key} id={`post-${post.id}`} className='Feed mb-3 p-3' style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <div className='col-1' style={{ display: "flex", width: "100%" }}>
                            <div className='col-11' style={{ display: "flex" }}>
                                <img alt="crypto" className='col-3 t-2' style={{ width: 42, height: 42, borderRadius: 100 }} src={post.user.image} />
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
                                        <div onClick={() => this.handleDeleteComment(post.id)} className="item ps-3 hover"
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
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Feed)
// export default Feed