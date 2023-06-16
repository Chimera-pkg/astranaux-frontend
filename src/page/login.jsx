import "../style/login.css";
import logo from "../assets/logo_small.png";
import drone from "../assets/Drone-Phantom.png";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEye, faEyeSlash, faAt } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import axios from "axios";
import baseUrl from '../config.jsx';

import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';

export const LoginPage = () =>{
    
    const [hiddenPass, setHidden] = useState(false);
    const [errorCheck, setCheck] = useState(false);
    const [errorActive, setActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const [msg, setMsg] = useState('');
    const history = useNavigate();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    // hidden password function state
    const changeHidden = () =>{
        setHidden(current => !current);
    }

    //authentication function to login
    const Auth = async(e) => {
        e.preventDefault();

        // activate loading animation while processing auth
        setLoading(true);

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try {
            await axios.post(`${baseUrl}/login`,{
                email: username,
                password: password,
		        withCredentials: true
            });

            // set initial session storage
            sessionStorage.setItem('userData', 'true');

	    const response = await axios.get(`${baseUrl}/token`,{withCredentials: true});
            const decode = jwt_decode(response.data.accessToken);
                const refreshToken = response.data.refreshToken;

                Cookies.set('refreshToken', response.data.refreshToken, { secure: true });
                    sessionStorage.setItem('userData', JSON.stringify(decode));
                document.cookie = `refreshToken=${refreshToken}`;


            // move to dashboard
            history('/dashboard');
        } catch (error) {
            // stop loading
            setLoading(false);

            if(error.response){
                setMsg(error.response.data.msg);
            }

            // show error notif state
            setCheck(current=>!current);
        }
    }

    // navigate register function
    const navigateReg = () =>{
        history('/register');
    }

    // async function to set error message animation timeout
    useEffect(() => {
        
        setActive(true);

        setTimeout(() => {
            setActive(false);
        }, 500);

    }, [errorCheck]);
 
    return(
        <div className="loginPage">
            <div className="loginForm">
                <div className="leftForm">
                    <h1>ASTRANAUX</h1>
                    <img src={drone} alt="" />
                </div>

                <div className="rightForm">
                    <img src={logo} alt="" />

                    <h3>Hello Again!</h3>
                    <p>Welcome to Astranaux, please fill your credential</p>
                    
                    <div className="formLogin">
            
                        <form onSubmit={Auth}>
                            <div className="formInput">
                                <input type="text" required="required" ref={usernameRef}/>
                                <span className="inputName">Email</span>
                                <span className="iconForm"><FontAwesomeIcon icon={faAt} /></span>
                            </div>
                            <div className="formInput">
                                <input type={hiddenPass === true ? "text" : "password"} required="required" ref={passwordRef}/>
                                <span className="inputName">Password</span>
                                <span className="iconFormPass">
                                    <FontAwesomeIcon onClick={changeHidden} icon={hiddenPass === true ? faEyeSlash   : faEye} />
                                </span>
                            </div>
                            <div className="errorMsg">
                                <h4 id="errorTeks" className={errorActive ? 'activeError' : 'inactiveError'}>{msg}</h4>
                            </div>
                            
                            <div className="buttonSubmit">
                                {!loading && <button type="submit" className="subButLog">Login</button>}
                                {loading && <button type="submit" className="subButLog"><div className="loaderLogin"></div></button>}
                            </div>
                            
                        </form>

                        <h5 className="registerLink" onClick={navigateReg}>Dont have an account? Register here</h5>
                    </div>
                </div>
            </div>  
        </div>
    )
}
