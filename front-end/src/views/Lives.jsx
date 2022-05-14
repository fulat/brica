import React, { useEffect, useRef, useContext } from 'react'
import { io } from "socket.io-client"
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthContextLogin from '../context/AuthLoging'

// import $ from 'jquery'

const socket = io("http://localhost:8000")


const Live = (props) => {
    const videoRef = useRef(null)
    const vRef = useRef(null)
    const params = useParams()
    const { currentUser } = useContext(AuthContextLogin)

    useEffect(() => {

        console.log(params.roomId)
        socket.emit("join-room", params.roomId, currentUser.uuid)

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            console.log("Owner:", currentUser.uuid)
            socket.emit("stream", stream)

            const video = videoRef.current
            video.srcObject = stream
            video.muted = true
            video.play()
        })




        // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        //     const video = videoRef.current
        //     video.srcObject = stream
        //     video.muted = true
        //     video.play()

        //     // setInterval(() => {
        //     //     playVideo(video, ctx)
        //     //     let mediaStram = canvas.toDataURL("image/webp")
        //     //     socket.emit("live-media", mediaStram)
        //     // }, 100)

        //     // socket.on("user-connected", (userId) => {
        //     //     requestAnimationFrame(() => {
        //     //     })
        //     // })

        //     // peer.on("call", call => {
        //     //     call.answer(stream)
        //     // })
        // })

    }, [])

    const playVideo = (video, ctx) => {
        ctx.drawImage(video, 0, 0, ctx.width, ctx.height)
    }

    const click = () => {

    }

    return (
        <div className="Live">
            <button onClick={click}>Click</button>
            <div id='streaming' className="col-8 ms-3 streaming-container">
                <video ref={videoRef}></video>
                <video ref={vRef}></video>
                {/* <canvas style={{ display: "none" }} width={512} height={256} ref={canvasRef}> </canvas> */}
            </div>
        </div>
    )

}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Live)





