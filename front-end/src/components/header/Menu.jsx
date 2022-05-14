import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCircleQuestion, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Dots from './Dots'
import { Popover } from 'antd';

class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            visible: false,
            item: [
                { icon: faGear, title: "Settings" },
                { icon: faCircleQuestion, title: "Support" },
                { icon: faRightFromBracket, title: "Logout" },
            ]
        }
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleVisibleChange = visible => {
        this.setState({ visible });
    };


    handleRediretion = (path) => {
        window.location.href = path
    }

    render() {
        const { user } = this.props
        return (
            <div className="hover active dots">
                <div className="dropdown" dir='center'>
                    <Popover placement="bottom"
                        content={
                            <div style={{ width: 300 }}>
                                <div onClick={() => this.handleRediretion(`/u/${user.username}`)} className='col-12 d-flex align-items-center p-3 hoverWithBG' style={{ height: 100, padding: 0 }}>
                                    <img alt="crypto" style={{ width: 45, height: 45, borderRadius: 100, }}
                                        src={user.image} />
                                    <div className="col d-flex flex-column justify-conten-center">
                                        <span className="title h6 ps-3 fw-bold">{user.firstName} {user.lastName}</span>
                                        <span className="profile ps-3">My Profile</span>
                                    </div>
                                </div>
                                {this.state.item.map((item, key) => (
                                    <div onClick={key !== 2 ? () => this.handleRediretion(`/${item.title.toLowerCase()}`) : () => { }} key={key} style={{ height: 60 }} className={`col-12 ${key === 2 ? "" : "mb-2"} d-flex align-items-center hoverWithBG`}>
                                        <div style={{ paddingLeft: 25 }} className="col-2 justify-conten-center align-items-center">
                                            <FontAwesomeIcon style={{ fontSize: 20, color: "gray" }} icon={item.icon} />
                                        </div>
                                        <div className="col-10">
                                            <span className="ps-3">{item.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                        trigger="click"
                        visible={this.state.visible}
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <div data-bs-toggle="dropdown" className="btn dropdown-toggle" display="dinamy" aria-expanded="false" id="dropdownBasic1">
                            <Dots color="#747474" />
                        </div>
                    </Popover>
                </div>
            </div>
        )
    }
}

export default Menu