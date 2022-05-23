import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import userAffiliate from "../../assets/affiliate-marketing.png"
import blockchain from "../../assets/blockchain.png"
import { Popover } from 'antd'


const Search = (props) => {
    const [datas, setDatas] = useState({})
    const [searchValue, setSearchValue] = useState("")
    const [visible, setVisible] = useState(false)


    const fetchData = async (e) => {
        if (e.target.value === "") {
            setDatas([])
            setSearchValue(e.target.value)
            setVisible(true)

        } else {
            const user = axios.get(`http://localhost:8000/users/search?search=${e.target.value.toLowerCase()}`, { headers: { type: "users", "x-api-key": "cbsdbcjhadvchgdvhcg" } })
            const cripto = axios.get(`http://localhost:8000/coins/search?search=${e.target.value.toLowerCase()}`, { headers: { type: "crypto", "x-api-key": "cbsdbcjhadvchgdvhcg" } })

            let keys = []
            let result = {}

            Promise.all([user, cripto]).then((res) => {
                res.forEach(promise => {
                    result[promise.data.search] = promise.data.data
                    keys.push(promise.data.search)
                })

                setDatas(result)
                setSearchValue(e.target.value)
            })
        }
    }

    const handleRediretion = (path) => {
        window.location.href = path
    }

    const PopoverContent = () => {
        return (
            <div style={{ width: 350 }}>
                {datas["users"] &&
                    <div className='users'>
                        {datas["users"].length > 0 &&
                            <div className="section" style={{ height: 50, paddingLeft: 25, display: "flex", alignItems: "center" }}>
                                <span style={{ fontWeight: "bold" }}>Users</span>
                            </div>
                        }
                        {datas.users.map((user, key) => (
                            <div onClick={() => handleRediretion(`/u/${user.username}`)} key={key} style={{ height: 60 }} className={`col-12 ${key === datas.users.length - 1 ? "" : "mb-2"} d-flex align-items-center hoverWithBG`}>
                                <div style={{ paddingLeft: 25 }} className="col-2 justify-conten-center align-items-center">
                                    <img alt="crypto" style={{ width: 30, height: 30, borderRadius: 100, imageResolution: "from-image" }} src={user.image} />
                                </div>
                                <div className="col-10 d-flex" style={{ justifyContent: "space-between" }}>
                                    <span className="ps-3 title">{user.firstName} {user.lastName}</span>
                                    <div className="col-2 d-flex justify-conten-center align-items-center" style={{ paddingRight: 20 }}>
                                        <img style={{ width: 25 }} src={userAffiliate} alt="crypto" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
                {datas["crypto"] &&
                    <div className='users'>
                        {datas["crypto"].length > 0 &&
                            <div className="section" style={{ height: 50, paddingLeft: 25, display: "flex", alignItems: "center" }}>
                                <span style={{ fontWeight: "bold" }}>Crypto</span>
                            </div>
                        }
                        {datas.crypto.map((crypto, key) => (
                            <li onClick={() => handleRediretion(`/c/${crypto.name}`)} key={key} style={{ height: 60 }} className={`col-12 ${key === datas.crypto.length - 1 ? "" : "mb-2"} d-flex align-items-center hoverWithBG`}>
                                <div style={{ paddingLeft: 25 }} className="col-2 justify-conten-center align-items-center">
                                    <img alt="crypto" style={{ width: 30, height: 30, borderRadius: 100 }} src={crypto.imageUrl} />
                                </div>
                                <div className="col-10 d-flex" style={{ justifyContent: "space-between" }}>
                                    <span className="ps-3 title">{crypto.name}</span>
                                    <div class="col-2 d-flex justify-conten-center align-items-center" style={{ paddingRight: 20 }}>
                                        <img style={{ width: 25 }} src={blockchain} alt="crypto" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </div>
                }
                {searchValue !== "" &&
                    <div className='users'>
                        <div className="section" style={{ height: 50, paddingLeft: 25, display: "flex", alignItems: "center" }}>
                            <span style={{ fontWeight: "bold" }}>More</span>
                        </div>
                        <li onClick={() => handleRediretion(`/s/${searchValue}`)} style={{ height: 60 }} className={`col-12 mb-2"} d-flex align-items-center hoverWithBG`}>
                            <div className="col-12 d-flex" style={{ justifyContent: "space-between", paddingLeft: 10, width: "100%" }}>
                                <span className="ps-3">Search: {searchValue}</span>
                                <div className="justify-conten-center" style={{ paddingRight: 25 }}>
                                    <FontAwesomeIcon style={{ fontSize: 18, color: "#CDCDCD" }} icon={faMagnifyingGlass} />
                                </div>
                            </div>
                        </li>
                    </div>
                }
            </div>
        )
    }

    const handleVisibleChange = () => {
        setVisible(!visible)
    }

    useEffect(() => {
        if (searchValue !== "") {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [searchValue])

    return (
        <ul className="Search navbar-nav me-auto  mb-lg-0 btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" id="dropdownBasic1">
            <div className="dropdown" dir='center'>
                <div data-bs-toggle="dropdown" aria-expanded="false" id="dropdownBasic1">
                    <input onChange={fetchData} className="form-control" type="search" placeholder="Search" aria-label="Search" />
                </div>
                <Popover placement="bottom" trigger="click" visible={visible} onVisibleChange={handleVisibleChange} content={PopoverContent} />
            </div>
        </ul>
    )
}

export default Search