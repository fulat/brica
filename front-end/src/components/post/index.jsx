import React, { useContext } from 'react'
import { faMicrophone, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
// import AuthContextLogin from "../../context/AuthLoging"


const Post = (props) => {
    const dispatch = useDispatch()
    // const { currentUser } = useContext(AuthContextLogin)


    const handleOnClick = () => {
        dispatch({ type: "SHOW_MODAL" })
    }


    const user = {}
    return (
        <section className="Post mb-3 p-3 ">
            <div aria-expanded="false" className='d-flex'>
                <div className='col-1 pt-1'>
                    {/* {!!currentUser.image && <img alt="crypto" className='col-3' style={{ width: 40, height: 40, borderRadius: 100 }} src={currentUser.image} />} */}
                </div>
                <div className='col-10 ms-3' style={{ display: "flex", flexDirection: "column", height: 80, justifyContent: "space-between" }}>
                    <div onClick={handleOnClick} className="form-control mb-0 mt-1 post hover" type="text" placeholder="Post something" aria-label="Post something" >
                        <small style={{ color: "gray" }}>Post something</small>
                    </div>
                    <div className="post-options p-3" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        {/* <label htmlFor="fs" className='hover'>
                            <div className="live hover" style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 20, color: "#0073DD" }} icon={faImage} />
                                <b className='ps-2'>Media</b>
                            </div>
                        </label> */}
                        <Link to={`/lives/1651335609022/${"md5(currentUser.uuid)"}`} style={{ color: "black" }}>
                            <div className="live hover" style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 20, color: "#F0497C" }} icon={faVideo} />
                                <b className='ps-2'>Go Live</b>
                            </div>
                        </Link>
                        <Link to={`/debate/fbfgshgfjfgjhkj`} style={{ color: "black" }}>
                            <div className="live hover" style={{ display: "flex", alignItems: "center" }}>
                                <FontAwesomeIcon style={{ fontSize: 20, color: "#7196B5" }} icon={faMicrophone} />
                                <b className='ps-2'>Debate</b>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default Post