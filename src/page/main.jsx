import { useEffect, useState } from "react";
import { CurrentMission } from "../component/current";
import { LocationDrone } from "../component/location";
import { Sidebar } from "../component/sidebar";
import { StatusConnection } from "../component/status";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';
import "../style/dashboard.css";
import React from 'react';
import baseUrl from '../config.jsx';


export const Dashboard = () =>{

    const [isLoggedIn, setLogged] = useState(false);

    // session check by session storage
    const checkSession = () =>{
        const sessionStatus = sessionStorage.getItem("userData");

        if(sessionStatus!==null && sessionStatus!==''){
            setLogged(true);
        }
        else{
            window.location.replace('/');
        }
    }

    // set token function on cookies
    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`,{withCredentials: true});
            const decode = jwt_decode(response.data.accessToken);
	        const refreshToken = response.data.refreshToken;
		
	        Cookies.set('refreshToken', response.data.refreshToken, { secure: true });
		    sessionStorage.setItem('userData', JSON.stringify(decode));
	        document.cookie = `refreshToken=${refreshToken}`;

        } catch (error) {
            console.log(error);
        }
    }

    // async function execution
    useEffect(() =>{
        refreshToken();
        checkSession();
    }, []);
    
    return(
        <div className="dashboard">
            {isLoggedIn &&
                <div>
                    <Sidebar></Sidebar>

                    <div className="contentDashboard">

                    <div className="topDashboard">
                        <div className="titleDashboard">
                            <h1 className="titleTeks">Dashboard</h1>
                            <h4 className="versionTeks">version 1.0</h4>
                        </div>

                        <StatusConnection></StatusConnection>
                    </div>
                    <LocationDrone></LocationDrone>
                    <CurrentMission></CurrentMission>
                    </div>
                </div>
            }
             
        </div>
    )
}
