import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCircleQuestion, faRightFromBracket, faBell } from '@fortawesome/free-solid-svg-icons'
import Dots from './Dots'
import { Popover } from 'antd'



const Notifications = (props) => {
    const [visible, setVisible] = useState(false)
    const [notifications] = useState([
        { icon: faGear, title: "Settings" },
        { icon: faCircleQuestion, title: "Support" },
        { icon: faRightFromBracket, title: "Logout" },
    ])


    const handleVisibleChange = visible => {
        setVisible(visible)
    }

    const handleRediretion = (path) => {
    }

    return (
        <div className="hover active dots">
            <div className="dropdown" dir='center'>
                <Popover placement="bottom" trigger="click" visible={visible} onVisibleChange={handleVisibleChange} content={
                    <div style={{ width: 300 }}>
                        {notifications.map((notification, key) => (
                            <div onClick={() => { }} key={key} style={{ height: 60 }} className={`col-12 pt-3 d-flex align-notifications-center hoverWithBG`}>
                                <div className="col-10">
                                    <span className="ps-3">{notification.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                } >
                    <div data-bs-toggle="dropdown" className="btn dropdown-toggle" display="dinamy" aria-expanded="false" id="dropdownBasic1">
                        <FontAwesomeIcon style={{ fontSize: 18, color: "gray" }} icon={faBell} />
                    </div>
                </Popover>
            </div>
        </div>
    )
}


export default Notifications