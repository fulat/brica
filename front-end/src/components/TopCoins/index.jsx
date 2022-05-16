import React, { Component } from 'react'
import { Link } from "react-router-dom"


class TopCoins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coins: [
                {
                    img: "https://s2.coinmarketcap.com/static/img/coins/200x200/8757.png",
                    title: "EverRise",
                    symbol: "RISE",
                    price: "$0.00102"
                },
                {
                    img: "https://pbs.twimg.com/media/E1nZnA9XEAA1xfY.png",
                    title: "Kishu Inu",
                    symbol: "KISHU",
                    price: "$0.000000001473"
                },
                {
                    img: "https://image.pngaaa.com/928/6178928-middle.png",
                    title: "Shiba Inu",
                    symbol: "SHIB",
                    price: "$0.00002502"
                },
                {
                    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWjIBWUuHeyoO37S2zQNEa9Lc7SqdiTt4dvSZ4pDlvKgdsUq12109njHaVHaSutT6yR20&usqp=CAU",
                    title: "Hoge Finance",
                    symbol: "HOGE",
                    price: "$0.00005072"
                },
                {
                    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
                    title: "Polygon",
                    symbol: "MATIC",
                    price: "$1.42"
                },
            ]
        };
    }

    handleRediretion = (path) => {
        window.location.href = path
    }
    render() {
        return (
            <section className="TopCoins p-3">
                <div className="title mb-3 mt-2 ms-2" style={{ fontSize: 18, height: 30 }}>
                    <b className='font-weight-bold' style={{ fontSize: 20 }}>Top Coins</b>
                </div>
                {this.state.coins.map((coin, key) => (
                    <div key={key} onClick={() => this.handleRediretion(`/c/${coin.title}`)} className="row hover" style={{ height: 60 }}>
                        <div className="token-img col-3">
                            <img src={coin.img} alt="logo" />
                        </div>
                        <div className="token-img col-9">
                            <b className='font-weight-bold' style={{ fontSize: 16 }}>{coin.title} <span style={{ color: "rgba(000,000,000,0.5)" }}>({coin.symbol})</span></b>
                            <span>{coin.price}</span>
                        </div>
                    </div>
                ))}
                <div className="more mt-1" style={{ paddingLeft: 5 }}>
                    <Link to="/c/top-coins">View more</Link>
                </div>
            </section>
        )
    }
}

export default TopCoins