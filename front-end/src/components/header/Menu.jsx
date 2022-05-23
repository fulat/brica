import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faCircleQuestion, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Dots from './Dots'
import { Popover } from 'antd'



const Menu = (props) => {
    const [visible, setVisible] = useState(false)
    const [item] = useState([
        { icon: faGear, title: "Settings" },
        { icon: faCircleQuestion, title: "Support" },
        { icon: faRightFromBracket, title: "Logout" },
    ])


    const handleVisibleChange = visible => {
        setVisible(visible)
    }

    const handleRediretion = (path) => {
        window.location.href = path
    }

    return (
        <div className="hover active dots">
            <div className="dropdown" dir='center'>
                <Popover placement="bottom"
                    content={
                        <div style={{ width: 300 }}>
                            <div onClick={() => handleRediretion(`/u/${props.user.username}`)} className='col-12 d-flex align-items-center p-3 hoverWithBG' style={{ height: 100, padding: 0 }}>
                                <img alt="crypto" style={{ width: 45, height: 45, borderRadius: 100, }}
                                    src={props.user.image} />
                                <div className="col d-flex flex-column justify-conten-center">
                                    <span className="title h6 ps-3 fw-bold">{props.user.firstName} {props.user.lastName}</span>
                                    <span className="profile ps-3">My Profile</span>
                                </div>
                            </div>
                            {item.map((item, key) => (
                                <div onClick={key !== 2 ? () => handleRediretion(`/${item.title.toLowerCase()}`) : () => { }} key={key} style={{ height: 60 }} className={`col-12 ${key === 2 ? "" : "mb-2"} d-flex align-items-center hoverWithBG`}>
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
                    visible={visible}
                    onVisibleChange={handleVisibleChange}
                >
                    <div data-bs-toggle="dropdown" className="btn dropdown-toggle" display="dinamy" aria-expanded="false" id="dropdownBasic1">
                        <Dots color="#747474" />
                    </div>
                </Popover>
            </div>
        </div>
    )
}


export default Menu