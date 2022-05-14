import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ImageModals extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleOk = () => {
        this.props.dispatch({ type: "HIDE_IMAGE_MODAL" })
    }

    handleCancel = () => {
        this.props.dispatch({ type: "HIDE_IMAGE_MODAL" })
    }

    render() {
        const { posts } = this.props.state
        return (
            <div className="ImageModals">
                <Modal
                    width={"50%"}
                    style={{ borderRadius: 15 }}
                    closeIcon={
                        <div className="emoji-container-close-icon mt-2 ms-2">
                            <FontAwesomeIcon
                                className='hover emoji-close-icon ps-3'
                                icon={faCircleXmark} />
                        </div>
                    }
                    footer={false}
                    centered
                    title=""
                    visible={posts.showImageModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}

                >
                    <div className='col-12' style={{ display: "flex", flexDirection: "column", width: "100%"}}>
                        <img style={{borderRadius: 10}} src={posts.showImageModalData} alt="" srcSet="" />
                    </div >
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({
    state, ownProps
})

export default connect(mapStateToProps)(ImageModals);