import "../style/sidebar.css";
import xllogo from "../assets/logo_small.png";
import jwt_decode from "jwt-decode";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import profil from "../assets/profile.png";

import { faTruckFast, faServer, faArrowRightFromBracket, faMapLocationDot, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react';
import baseUrl from '../config.jsx';

export const Sidebar = () =>{

    const { pathname } = useLocation();
    const currentLocation = pathname.slice(1);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [count, setCount] = useState(0);
    const [dropMenu, setDrop] = useState(false);

    const Logout = async() =>{
        try {
            sessionStorage.setItem('userData', '');
            window.location.replace('/');
            await axios.delete(`${baseUrl}/logout`);
        } catch (error) {
            console.log(error);
        }
    }

    const showDrop = () =>{
        setDrop(current=>!current);
    }

    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`);
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);

            // setName(decode.name);
            // setEmail(decode.email);
        } catch (error) {
            console.log(error);
        }
    }

    const getUserData = () =>{
        const userData = JSON.parse(sessionStorage.getItem('userData'));

        setName(userData.name);
        setEmail(userData.email);
    }

    useEffect(() =>{
        refreshToken();
        getUserData();
    }, [count]);

    return(
        <div className="sidebar">
             <div className="topBar">
                <div className="titleBar">
                    <img src={xllogo} alt="" />
                </div>

                <div className="barIcon">
                    <FontAwesomeIcon icon={dropMenu === true?  faXmark:faBars} onClick={showDrop} className="hamburgerBar"/>
                </div>

                <div className={dropMenu === true? "dropMenuList" : "dropNone"}>
                    <div className="menuDrop">
                        <ul>
                            <li><Link to="/dashboard"><h5 className={currentLocation === "dashboard" ? "menuActiveDrop" : "menuInactiveDrop"}>Dashboard</h5></Link></li>
                            <li><Link to="/delivery"><h5 className={currentLocation === "delivery" ? "menuActiveDrop" : "menuInactiveDrop"}>Delivery</h5></Link></li>
                            <li><Link to="/waypoint"><h5 className={currentLocation === "waypoint" ? "menuActiveDrop" : "menuInactiveDrop"}>Waypoints</h5></Link></li>
                        </ul>
                    </div>
                    <div className="profilInfoDrop">
                        <img src={profil} alt="" />
                        <h1 className="nameInfoDrop">{name}</h1>
                        <h3 className="emailInfoDrop">{email}</h3>
                    </div>
                    <div className="logoutSectionDrop">
                        <button onClick={Logout}><FontAwesomeIcon icon={faArrowRightFromBracket}/>  Logout</button>
                    </div>
                </div>

                <div className="menuList">
                    <ul>
                        <li>
                            <FontAwesomeIcon icon={faServer} className={currentLocation === "dashboard" ? "ikonMenuActive" : "ikonMenuInactive"}/>
                            <Link to="/dashboard">
                                <h5 className={currentLocation === "dashboard" ? "menuActive" : "menuInactive"}>
                                    Dashboard
                                </h5>
                            </Link>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faTruckFast} className={currentLocation === "delivery" ? "ikonMenuActive" : "ikonMenuInactive"}/>
                            <Link to="/delivery">
                                <h5 className={currentLocation === "delivery" ? "menuActive" : "menuInactive"}>
                                    Delivery
                                </h5>
                            </Link>
                        </li>
                        <li> 
                            <FontAwesomeIcon icon={faMapLocationDot} className={currentLocation === "waypoint" ? "ikonMenuActive" : "ikonMenuInactive"}/>
                            <Link to="/waypoint">
                                <h5 className={currentLocation === "waypoint" ? "menuActive" : "menuInactive"}>
                                    Waypoints
                                </h5>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="profilInfo">
                    <img src={profil} alt="" />
                    <h1 className="nameInfo">{name}</h1>
                    <h3 className="emailInfo">{email}</h3>
                </div>

                <div className="logoutSection">
                    <button onClick={Logout}><FontAwesomeIcon icon={faArrowRightFromBracket}/>  Logout</button>
                </div>
             </div>
        </div>
    )
}
