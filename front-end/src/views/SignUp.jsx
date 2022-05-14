import React, { useState } from 'react'

const SignUp = () => {
    const [wallet, setWallet] = useState("")

    const handleConnection = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
                setWallet("connected")
                console.log(accounts)
                localStorage.setItem("ethAddress", accounts[0])
                window.location.reload()
            })
        } else {
            setWallet("no connected")
        }
    }

    return (
        <div className="SignUp" style={{ background: "white", height: "100vh" }}>
            <button onClick={handleConnection}>Connect to Metamask</button>
            <span>{wallet}</span>
        </div>
    )
}

export default SignUp