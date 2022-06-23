import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import Logo from "../../assets/logo.png"
import Search from './Search'
import Menu from './Menu'
import Notification from './Notifications'
import { connect } from 'react-redux'
import AuthContextLogin from "../../context/AuthLoging"


const Header = () => {
    const { currentUser } = useContext(AuthContextLogin)
    const [wallet, setWallet] = useState("")

    const handleConnectionLogout = async () => {
        if (window.ethereum) {
            localStorage.clear()
            window.location.reload()
        } else {
            setWallet("no connected")
        }
    }

    return (
        <div className="Header" style={{ width: "100%" }}>
            <div className="container">
                <nav className="navbar navbar-expand-lg d-flex" style={{ background: "white", alignItems: "center", height: 60 }}>
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">
                            <img style={{ width: 35, height: 35 }} src={Logo} alt="" srcSet="" />
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <FontAwesomeIcon fontSize={24} icon={faBars} />
                        </button>
                        <div className="collapse sr navbar-collapse" id="navbarSupportedContent">
                            <Search />
                            <Menu user={currentUser} />
                            <div className="theme hover active">
                                <Notification />
                            </div>
                            <div>
                                <button onClick={handleConnectionLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </nav >
            </div >
        </div >
    )
}

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Header)
