import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCircleQuestion, faRightFromBracket, faBell } from '@fortawesome/free-solid-svg-icons'

class Notification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            item: [
                { icon: faGear, title: "Settings" },
                { icon: faCircleQuestion, title: "Support" },
                { icon: faRightFromBracket, title: "Logout" },
            ]
        }
    }

    handleRediretion = (path) => {
        window.location.href = path
    }

    render() {
        return (
            <div className="hover active dots">
                <div className="dropdown" dir='center'>
                    <div data-bs-toggle="dropdown" className="btn dropdown-toggle" display="dinamy" aria-expanded="false" id="dropdownBasic1">
                        <FontAwesomeIcon style={{ fontSize: 16, color: "#747474" }} icon={faBell} />
                    </div>
                    <ul style={{ marginTop: 15 }} className="dropdown-menu dropdown-menu-start dropdown-menu-lg-start" aria-labelledby="dropdownMenuButton1">
                        {this.state.item.map((item, key) => (

                            <li onClick={key !== 2 ? () => this.handleRediretion(`/${item.title.toLowerCase()}`) : () => { }} key={key} style={{ height: 60 }} className={`col-12 ${key === 2 ? "" : "mb-2"} d-flex align-items-center hoverWithBG`}>
                                <div style={{ paddingLeft: 25 }} className="col-2 justify-conten-center align-items-center">
                                    <FontAwesomeIcon style={{ fontSize: 20, color: "gray" }} icon={item.icon} />
                                </div>
                                <div className="col-10">
                                    <span className="ps-3">{item.title}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Notification