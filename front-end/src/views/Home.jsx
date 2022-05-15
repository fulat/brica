import React, { Component } from 'react'
import TopCoins from "../components/TopCoins"
import Post from "../components/post/"
import Feeds from '../components/post/feed'
import Modals from '../components/post/modal'
import { connect } from 'react-redux'
import APIsContext from "../context/APIsContext"
import OurToken from "../components/ourToken"
import axios from 'axios'

class Home extends Component {
    static contextType = APIsContext
    constructor(props) {
        super(props);
        this.state = {
            feeds: []
        };
    }

    fetchPosts = async () => {
        await axios.get(`/posts/followers/${2}`).then((res) => {
            let posts = []
            if (!res.data.data.error) {
                res.data.data.forEach(post => {
                    posts.push(post.user.posts)
                })
            }
            this.setState({
                feeds: this.sortDESC([].concat.apply([], posts))
            })
            // console.log(this.sortDESC([].concat.apply([], posts)))
        })

    }

    sortDESC = (arr) => arr.sort((a, b) => b.id - a.id)

    componentDidMount() {
        this.fetchPosts()
    }


    render() {
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
}


const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Home)

