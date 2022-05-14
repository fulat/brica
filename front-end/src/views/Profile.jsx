import axios from 'axios';
import React, { Component } from 'react'


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    fetchUser = async () => {
        await axios.get(`users/q/${this.props.match.params.username}`).then((res) => {
            this.setState({
                user: res.data.data
            })
            console.log(this.props.match.params.username)
        }).catch((err) => {
            console.error(err)
        })
    }

    componentDidMount() {
        // this.fetchUser()
    }

    render() {
        return (
            <div className="Profile">
                <h2>{this.state.user.firstName} {this.state.user.lastName}</h2>
            </div>
        );
    }
}


export default Profile