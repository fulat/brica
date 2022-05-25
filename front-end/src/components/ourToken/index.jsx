import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BigNumber } from "bignumber.js"


const OurToken = (props) => {
    const [price, setPrice] = useState("")

    const fetchToken = async () => {
        axios.get("coins/our-token").then((res) => {
            const token = res.data?.TOKEN[0]?.price
            const decimals = res.data?.TOKEN[0]?.baseCurrency.decimals
            const weth = res.data?.WETH[0]?.price
            setPrice(new BigNumber(token * weth).toFixed(decimals))
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchToken()
    }, [])

    return (
        <div className="OurToken mb-3 col hover">
            <div className="token-img col-3">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWjIBWUuHeyoO37S2zQNEa9Lc7SqdiTt4dvSZ4pDlvKgdsUq12109njHaVHaSutT6yR20&usqp=CAU" alt="logo" />
            </div>
            <div className="col-9" style={{ display: "flex", flexDirection: "column" }}>
                <b className='font-weight-bold' style={{ fontSize: 16 }}>Hoge Finance <span style={{ color: "rgba(000,000,000,0.5)", fontSize: 14 }}>HOGE</span></b>
                <span>{`$${price}`}</span>
            </div>

        </div>
    )
}


export default OurToken