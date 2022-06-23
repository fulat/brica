import React, { createContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SignUp from '../views/SignUp'
import Cookies from 'universal-cookie'
import axios from 'axios'
import Header from '../components/header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from '../redux/apiFetchs'

const AuthContextLogin = createContext()

export const AuthLogin = () => {
    const [auth, setAuth] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const cookies = new Cookies()
    const dispatch = useDispatch()

    useEffect(() => {
        const createUser = async () => {
            if (localStorage.getItem("ethAddress")) {
                await axios.post("/users", {
                    firstName: "undefined",
                    lastName: "undefined",
                    username: Date.now() + "",
                    uuid: localStorage.getItem("ethAddress").toLowerCase(),
                    image: "http://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                }).then(async (res) => {
                    cookies.set("ss_us_tnk", res.data.token, {
                        path: "/",
                        sameSite: "none",
                        secure: true,
                        exp: Math.floor(Date.now() / 1000),
                        maxAge: new Date().getSeconds() + 2
                    })
                    setCurrentUser(res.data.user)
                    dispatch(fetchCurrentUser(localStorage.getItem("ethAddress")))
                    setAuth(true)
                })
            } else {
                cookies.remove("ss_us_tnk")
                setAuth(false)
            }
        }
        createUser()
    }, [])

    return (
        <AuthContextLogin.Provider value={{ currentUser }}>
            {auth ?
                <div>
                    <Header />
                    <Outlet />
                </div>
                : <SignUp />}
        </AuthContextLogin.Provider >
    )
}


export default AuthContextLogin