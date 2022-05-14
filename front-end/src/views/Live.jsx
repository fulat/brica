import React, { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'



const Live = (props) => {
    const videRef = useRef(null)
  

    return (
        <div className="Live">
            <div className="col-8 ms-3 streaming-container">
                <img ref={videRef} alt="kmnklj" />
            </div>
            <div id='streaming' className="col-4 ms-3" style={{ background: "white" }}>
                nkjnnjh
            </div>
        </div>
    )
}

export default Live