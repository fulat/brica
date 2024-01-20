import { faCircleArrowLeft, faCircleXmark, faEarthAmerica, faFaceSmile, faImage, faLock, faMicrophone, faUserGroup, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Select } from 'web3uikit'
// import Picker from 'emoji-picker-react'
import Resizer from "react-image-file-resizer"
import { Modal } from 'antd'
import axios from 'axios'
import Cookies from 'universal-cookie'
import AuthContextLogin from "../../context/AuthLoging"


const CreatePost = (props) => {
    const [hasVideo, setHasVideo] = useState(false)
    const [file, setFile] = useState(false)
    const [hasMedia, setHasMedia] = useState(false)
    const [showVisivility, setShowVisivility] = useState(false)
    const [emoji, setEmoji] = useState(null)
    const [value, setValue] = useState("")
    const [selectOptions, setSelectOptions] = useState("public")
    // const [scrollHeight, setScrollHeight] = useState(0)
    // const [isModalVisible, setIsModalVisible] = useState(false)
    // const [imageUrl, setImageUrl] = useState("none")
    const textAreaRef = useRef()

    const { users, posts } = props.state
    const fileRef = useRef()
    const lStorage = JSON.parse(localStorage.getItem("Parse/M7GZzjiito65lVhn26wVeBXJXSdXKxq0QGhjEfUA/currentUser"))
    const cookies = new Cookies()
    const tokenCookie = cookies.get("ss_us_tnk")
    const { currentUser } = useContext(AuthContextLogin)


    const onEmojiClick = (event, emoji) => {
        setValue(value + emoji.emoji)
        setShowVisivility(false)
    }

    const handleOnChange = (e) => {
        setShowVisivility(false)
        setValue(e.target.value)

        const textArea = document.getElementById("textArea")
        textArea.style.minHeight = 0
        textArea.style.minHeight = (textArea.scrollHeight) + "px"
    }

    const handleOnSelect = ({ id }) => {
        // setSelectOptions(id)
    }

    const handleMedia = () => {
        // setState({
        //     postType: "media"
        // })
        // console.log(fileRef)

    }

    const handleOnChangeFile = (e) => {

        console.log(e.target.files[0].type.slice(0, 5));
        if (e.target.files[0] && e.target.files[0].type.slice(0, 5) == "image") {
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
                            const output = document.getElementById('output')
                            output.src = reader.result
                        }
                        reader.readAsDataURL(e.target.files[0])
                        // setImageUrl(uri)
                        setHasMedia(true)
                        setShowVisivility(false)
                        setFile(e.target.files[0])

                        const textArea = document.getElementById("textArea")
                        textArea.style.height = 0
                        textArea.style.height = (textArea.scrollHeight) + "px"
                    },
                    "base64",
                    200,
                    200
                );
            } catch (err) {
                console.log(err);
            }
        } else {
            const reader = new FileReader()
            reader.onload = () => {
                const output = document.getElementById('video-output')
                output.src = reader.result
                setFile(reader.result)
            }
            reader.readAsDataURL(e.target.files[0])
            //  // setImageUrl(uri)
            setHasMedia(false)
            setHasVideo(true)
            setShowVisivility(false)
        }
    }

    const showModal = () => {
        props.dispatch({ type: "SHOW_MODAL" })
    }

    const handleOk = () => {
        props.dispatch({ type: "HIDE_MODAL" })
    }

    const handleCancel = () => {
        props.dispatch({ type: "HIDE_MODAL" })
    }

    const handleCloseImage = () => {
        // setImageUrl("none")
        setHasMedia(false)
        setShowVisivility(false)

        const output = document.getElementById('output')
        const textArea = document.getElementById("textArea")
        output.src = ""
        textArea.style.height = 250 + "px"
    }

    const handlePost = async () => {

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ugy6mqfd")

        if (hasMedia || hasVideo) {
            const file = await axios.post("https://api.cloudinary.com/v1_1/dbsswqtg9/image/upload", formData)
            if (file) {
                await axios.post(`posts/${currentUser.uuid}`, {
                    imageUrl: file.data.url,
                    body: value === "" ? null : value,
                }, { headers: { authorization: tokenCookie } }).then((res) => {
                    window.location.reload()
                })
            }
        } else {
            await axios.post(`posts/${currentUser.uuid}`, {
                imageUrl: null,
                body: value,
            }, { headers: { authorization: tokenCookie } }).then((res) => {
                window.location.reload()
            })
        }
    }

 

    return (
        <Modal
            width={500}
            closable={showVisivility ? false : true}
            style={{ borderRadius: 15 }}
            closeIcon={
                <div className="emoji-container-close-icon">
                    <FontAwesomeIcon
                        className='hover emoji-close-icon ps-3'
                        icon={faCircleXmark} />
                </div>
            }
            centered
            title=""
            visible={posts.show} onOk={handleOk}
            onCancel={handleCancel}
            footer={
                <div style={{ width: 500, height: 50, }}>
                    <div style={{ display: "flex" }}>
                        <div onClick={handleMedia} style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <label htmlFor='file' className='hover' style={{ display: "flex", alignItems: "center" }} >
                                <FontAwesomeIcon style={{ fontSize: 20, color: "#0073DD" }} icon={faImage} />
                                <b className='ps-2'>Media</b>
                            </label>
                        </div>
                        <input ref={fileRef} onChange={handleOnChangeFile} accept="image/*,video/*" style={{ display: "none" }} type="file" id="file" />
                        <div className="live hover" style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <FontAwesomeIcon style={{ fontSize: 20, color: "#F0497C" }} icon={faVideo} />
                            <b className='ps-2'>Go Live</b>
                        </div>
                        <div className="live hover" style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <FontAwesomeIcon style={{ fontSize: 20, color: "#7196B5" }} icon={faMicrophone} />
                            <b className='ps-2'>Debate</b>
                        </div>
                        <div onClick={handlePost} className="live hover post-button" style={{ display: "flex", alignItems: "center", margin: 20 }}>
                            <button className='hover'>Post</button>
                        </div>
                    </div>
                    <div className="emoji-container">
                        <FontAwesomeIcon
                            onClick={() => setShowVisivility(!showVisivility)}
                            className='hover emoji ps-3'
                            icon={faFaceSmile} />
                    </div>
                    {/* {showVisivility && <Picker
                        groupNames={""}
                        disableSearchBar
                        onEmojiClick={onEmojiClick}
                        disableSkinTonePicker
                        disableAutoFocus
                    />} */}
                </div>
            }>
            <div className='col-1' style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-between" }}>
                <div className='ps-1 col-9' style={{ display: "flex" }}>
                    <img alt="crypto" className='col-3'
                        style={{ width: 42, height: 42, borderRadius: 100, imageResolution: "from-image" }}
                        src={currentUser.image}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <b className='ms-2 ps-3' style={{ color: "black", fontSize: 18 }}>{users.user.firstName} {users.user.lastName}</b>
                        <Select
                            style={{ border: "none" }}
                            defaultOptionIndex={0}
                            onChange={handleOnSelect}
                            options={[
                                {
                                    id: 'public',
                                    label: 'Public',
                                    prefix: <FontAwesomeIcon icon={faEarthAmerica} />
                                },
                                {
                                    id: 'private',
                                    label: 'Private',
                                    prefix: <FontAwesomeIcon icon={faLock} />
                                },
                                {
                                    id: 'friends',
                                    label: 'Friends',
                                    prefix: <FontAwesomeIcon icon={faUserGroup} />
                                }
                            ]}
                        />
                    </div>
                </div>
                <div className="to-scroll">
                    <div className="text" style={{ minHeight: 250 }}  >
                        <textarea autoFocus id="textArea" onChange={handleOnChange} value={value} className='p-2' placeholder='Type something...'>
                        </textarea>
                        <div>
                            {hasMedia && <div onClick={handleCloseImage} className="close-img hover">
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </div>}
                            {hasMedia && <img alt='output' style={{ width: 450 }} id="output" />}
                            {hasVideo && <video controls style={{ width: 450 }} id="video-output"></video>}
                        </div>
                    </div>
                </div>
                {showVisivility && <div className="emoji-container-close">
                    <FontAwesomeIcon
                        onClick={() => setShowVisivility(!showVisivility)}
                        className='hover emoji-close ps-3'
                        icon={faCircleArrowLeft} />
                </div>}
            </div >
        </Modal>
    )
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(CreatePost)

