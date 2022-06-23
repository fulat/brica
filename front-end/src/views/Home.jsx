import React, { useEffect } from 'react'
import TopCoins from "../components/TopCoins"
import Post from "../components/post/"
import Feeds from '../components/post/feed'
import Modals from '../components/post/modal'
import { useDispatch, useSelector } from 'react-redux'
import { show } from '../redux/slicers/modalSlice'
import { fetchFeeds } from '../redux/apiFetchs'


const Home = () => {
    return (
        <div className="Home">
            <div className="row container">
                <div className="col-3" style={{ height: 500, padding: 0, marginRight: 7 }}>
                    {/* <OurToken /> */}
                    <TopCoins />
                </div>
                <div className="col-6 ps-2" style={{ height: 500, padding: 0 }}>
                    <div className="scroll">
                        <Post />
                        <Feeds />
                    </div>
                </div>
            </div>
            <Modals />
        </div>
    )
}

export default Home

