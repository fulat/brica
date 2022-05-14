import React, { createContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import SignUp from '../views/SignUp'

import { connect } from 'react-redux'


const APIs = (props) => {
    const [auth, setAuth] = useState(false)

    return (
        auth ? <Outlet /> : <SignUp />
    )
}


const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(APIs)