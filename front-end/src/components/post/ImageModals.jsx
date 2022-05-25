import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Modals(props) {
    const { posts } = props.state

    const handleOk = () => {
        props.dispatch({ type: "HIDE_IMAGE_MODAL" })
    }

    const handleCancel = () => {
        props.dispatch({ type: "HIDE_IMAGE_MODAL" })
    }

    const ModalIcon = () => (
        <div className="emoji-container-close-icon mt-2 ms-2">
            <FontAwesomeIcon className='hover emoji-close-icon ps-3' icon={faCircleXmark} />
        </div>
    )

    return (
        <div className="ImageModals">
            <Modal width={"50%"} style={{ borderRadius: 15 }} footer={false} centered title="" visible={posts.showImageModal} onOk={handleOk} onCancel={handleCancel} closeIcon={ModalIcon}>
                <div className='col-12' style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <img style={{ borderRadius: 10 }} src={posts.showImageModalData} alt="" srcSet="" />
                </div>
            </Modal>
        </div>
    )
}


const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(Modals)