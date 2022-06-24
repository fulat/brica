import React, { useContext, useEffect, useState } from 'react'
import { faEllipsis, faHeart, faShare, faCamera, faCircleXmark, faComment, faEyeSlash, faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import moment from 'moment'
import { connect, useDispatch } from 'react-redux'
import $ from "jquery"
import AuthContextLogin from '../../context/AuthLoging'
import { Link } from 'react-router-dom'
import Resizer from "react-image-file-resizer"
import ImageModals from '../post/ImageModals'
import Reply from '../replies/Reply'
import { Popover } from 'antd'
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react'

const PostComment = (props) => {
    const [comments, setComments] = useState([])
    const [limit, setLimit] = useState(1)
    const [inputHeight, setInputHeight] = useState(35)
    const [hasMedia, setHasMedia] = useState(false)
    const [hasEmoji, setHasEmoji] = useState([])
    const [count, setCount] = useState(0)
    const [body, setBody] = useState("")
    const [file, setFile] = useState(null)
    const { currentUser } = useContext(AuthContextLogin)
    const dispatch = useDispatch()

    const handleOnCommentChange = (e, id) => {
        setBody(e.target.value)

        if (matchExpression(e.target.value) || hasMedia) {
            $(`#button-post-${id}`).show()
        } else {
            $(`#button-post-${id}`).hide()
        }

        const textArea = document.getElementById(`input-from-post-${post.id}`)
        textArea.style.minHeight = 0
        textArea.style.minHeight = (textArea.scrollHeight) + "px"
        setInputHeight(0)
        setInputHeight(textArea.scrollHeight)
    }

    const matchExpression = (str) => {
        const rgularExp = {
            contains_alphaNumeric: /^(?!-)(?!.*-)[A-Za-z0-9-]+(?<!-)$/,
            containsNumber: /\d+/,
            containsAlphabet: /[a-zA-Z]/,
            containsSymbol: /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
            containsEmoji: /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u,
            onlyLetters: /^[A-Za-z]+$/,
            onlyNumbers: /^[0-9]+$/,
            onlyMixOfAlphaNumeric: /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/
        }

        const expMatch = {};
        expMatch.containsNumber = rgularExp.containsNumber.test(str);
        expMatch.containsAlphabet = rgularExp.containsAlphabet.test(str);
        expMatch.containsSymbol = rgularExp.containsSymbol.test(str);
        expMatch.containsEmoji = rgularExp.containsEmoji.test(str);
        expMatch.alphaNumeric = rgularExp.contains_alphaNumeric.test(str);

        expMatch.onlyNumbers = rgularExp.onlyNumbers.test(str);
        expMatch.onlyLetters = rgularExp.onlyLetters.test(str);
        expMatch.mixOfAlphaNumeric = rgularExp.onlyMixOfAlphaNumeric.test(str);

        if (rgularExp.containsNumber.test(str) || rgularExp.contains_alphaNumeric.test(str) || rgularExp.containsAlphabet.test(str) || rgularExp.containsSymbol.test(str) || rgularExp.containsEmoji.test(str)) return true
        return false
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

    const handleOnCommentPost = async (postId) => {
        const { id } = currentUser

        const text = body.replace(/ /g, "/n")
        text.replace(/\n/g, "[n1]")
        console.log(text, "Ok")

        // const formData = new FormData()
        // formData.append("file", file)
        // formData.append("upload_preset", "ugy6mqfd")

        // if (hasMedia) {
        //     const file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
        //     if (file) {
        //         await axios.post("comments", { postId, userId: id, body: body === "" ? null : body, imageUrl: file.data.url, parentId: null }).then((res) => {
        //             setBody("")
        //             setHasMedia(false)

        //             $(`#input-from-post-${postId}`).val("")
        //             $(`#toggle-comment-from-${postId}`).show()
        //             $(`#button-post-${postId}`).hide()
        //             fetchComments(limit < 1 ? 3 : limit)
        //         })
        //     }
        // } else {
        //     await axios.post("comments", { postId, userId: id, body, imageUrl: null, parentId: null }).then((res) => {
        //         setBody("")
        //         setHasMedia(false)

        //         $(`#input-from-post-${postId}`).val("")
        //         $(`#toggle-comment-from-${postId}`).show()
        //         $(`#button-post-${postId}`).hide()
        //         fetchComments(limit < 1 ? 3 : limit)
        //     })
        // }
        // alert(limit)
    }

    const handleCloseImage = (id) => {
        setHasMedia(false)
        setFile(null)
        $(`#output-comment-media`).hide()
        $(`#button-post-${id}`).hide()
    }

    const onEmojiClick = (e, emojiObject, id) => {
        setBody(body + emojiObject.emoji)
        setHasEmoji(true)

        if (body.length >= 0 || hasMedia) {
            $(`#button-post-${id}`).show()
        } else {
            $(`#button-post-${id}`).hide()
        }
    }

    const fetchComments = async (limit) => {
        await axios.get(`/comments/post/${props.post.id}?limit=${limit}`).then((res) => {
            if (!res.data.error) {
                setComments(res.data.data?.rows)
                setCount(res.data.data?.count)
            }
        })
    }

    useEffect(() => {
        fetchComments(1)
    }, [])

    const { post } = props

    return (
        <div className='cmt' id={`comment-post-${post.id}`}>
            <div style={{ height: inputHeight, display: "flex", alignItems: inputHeight > 40 ? "flex-end" : "center" }} className="comment-post-container mt-3">
                <textarea style={{ height: 30 }} id={`input-from-post-${post.id}`} value={body} onChange={(e) => handleOnCommentChange(e, post.id)} className="form-control ms-1" type="text" placeholder="Type a comment" aria-label="Post something"></textarea>
                <Popover trigger="click" content={
                    <div style={{ width: 350, height: 400 }}>
                        <Picker className="p-1" onEmojiClick={(e, emojiObject) => onEmojiClick(e, emojiObject, post.id)} skinTone={SKIN_TONE_MEDIUM_DARK} />
                    </div>
                }>
                    <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FontAwesomeIcon className='hover' style={{ fontSize: 17, color: "rgba(000, 000, 000, 0.3)" }} icon={faFaceSmile} />
                        </span>
                    </div>
                </Popover>
                <div style={{ height: 35, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <label htmlFor="cameraFile" style={{ width: 40, marginTop: 2 }}>
                        <FontAwesomeIcon className='hover' style={{ fontSize: 18, color: "rgba(000, 000, 000, 0.3)" }} icon={faCamera} />
                        <input onChange={(e) => handleCommediaMediaOnChange(e, post.id)} style={{ display: "none" }} type="file" name="" id="cameraFile" />
                    </label>
                </div>
                <button id={`button-post-${post.id}`} style={{ display: "none" }} onClick={() => handleOnCommentPost(post.id)} className={`${inputHeight > 40 && "mb-1"} hover comment-post ml-2`}>Post</button>
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
    );
}

export default PostComment
