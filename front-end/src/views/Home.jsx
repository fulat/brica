import React, { Component } from 'react'
import TopCoins from "../components/TopCoins"
import Post from "../components/post/"
import Feed from '../components/post/feed'
import Modals from '../components/post/modal'
import { connect } from 'react-redux'
import AuthContextLogin from "../context/AuthLoging"
import OurToken from "../components/ourToken"

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { currentUser } = this.context
        this.props.dispatch({ type: "" })
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
                            <Feed />
                        </div>
                    </div>
                </div>
                <Modals />
            </div>
        )
    }
}

Home.contextType = AuthContextLogin

const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Home)

