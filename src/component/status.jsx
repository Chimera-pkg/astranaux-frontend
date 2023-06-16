import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import refresh from "../assets/refresh.png";

import "../style/status.css";
import React from 'react';
import baseUrl from '../config.jsx';


export const StatusConnection = () =>{

    const [bar1, setBar1] = useState('bar-1');
    const [bar2, setBar2] = useState('bar-2');
    const [bar3, setBar3] = useState('bar-3');
    const [bar4, setBar4] = useState('bar-4');

    const [token, setToken] = useState('');
    const [speedNow, setSpeed] = useState([]);
    const [connNow, setConn] = useState();

    const [statusPower, setPower] = useState();
    const [statusBand, setType] = useState('');
    const [position, setPosition] = useState('');

    const [loading, setLoading] = useState(false);

    const checkBar = () =>{    
        const strength = parseInt(sessionStorage.getItem('powerNow'));
        
        if(strength === undefined || strength === 999){
            setBar1('bar-1-inactive');
            setBar2('bar-2-inactive');
            setBar3('bar-3-inactive');
            setBar4('bar-4-inactive');
        }

        else if(strength>-80){
            setBar4('bar-4-active-four');  
            setBar3('bar-3-active-four');
            setBar2('bar-2-active-four');
            setBar1('bar-1-active-four');
        }

        else if(strength<=-80 && strength>=-90){
            setBar3('bar-3-active-three');
            setBar2('bar-2-active-three');
            setBar1('bar-1-active-three');
            setBar4('bar-4-inactive');
        }

        else if(strength<-90 && strength>-100){
            setBar2('bar-2-active-two');
            setBar1('bar-1-active-two');
            setBar3('bar-3-inactive');
            setBar4('bar-4-inactive');
        }

        else if(strength<=-100){
            setBar1('bar-1-active-only');
            setBar2('bar-2-inactive');
            setBar3('bar-3-inactive');
            setBar4('bar-4-inactive');
        }
    }

    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`);
            setToken(response.data.accessTokenType);
            const decode = jwt_decode(response.data.accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const getSpeed = async() => {
        try {
            const response = await axios.get('https://astranaux.com/speed');
            setSpeed(response.data);
	    console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const strengthValue = (x) =>{
        const qrsrpArray = x.split(',');
        const numArray = qrsrpArray.slice(0, 4).map(num => parseInt(num));
        const sum = numArray.reduce((total, value) => total + value);
        const avg = sum / numArray.length;
        setPower(avg);
        sessionStorage.setItem('powerNow', avg);
    }

    const typeValue = (x) =>{
        const qrsrpArray = x.split(',');
	const type = qrsrpArray[4].replace(/\r\n\r\nOK/g, "");
        setType(type);
        sessionStorage.setItem('typeNow', type);
    }

    useEffect(() => {
        const ws = new WebSocket('wss://www.astranaux.com');
        let timeout;

        const resetTimeout = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setConn(0);
                setPosition('----');
                setPower(undefined);
                setType('----');
                setLoading(false);

                sessionStorage.setItem('typeNow', '----');
                sessionStorage.setItem('connNow', 0);
                sessionStorage.setItem('powerNow', 999);
                sessionStorage.setItem('positionNow', '----');

                checkBar();
            }, 10000);
        };

    
        ws.onopen = () => {
	    setLoading(true);
        };
    
        ws.onmessage = (event) => {
            resetTimeout();
            setLoading(true);
            const dataRaw = JSON.parse(event.data);
	    
	    const cleanData = dataRaw.message;
            const realData = JSON.parse(cleanData);

            setConn(realData.status_conn);
            setPosition(realData.vehicle_mode);

            sessionStorage.setItem('connNow', realData.status_conn);
            sessionStorage.setItem('positionNow', realData.vehicle_mode);

            typeValue(realData.qrsrp);
            strengthValue(realData.qrsrp);
        };
    
        ws.onclose = () => {
	    setLoading(false);
            clearTimeout(timeout);
        };
	
	ws.onerror = (error) => {
	  console.error("WebSocket error:", error);
	};


        resetTimeout();
    
        return () => {
            clearTimeout(timeout);
            ws.close();
            setLoading(false);
        };
    }, []);

    useEffect(() =>{
        checkBar();
    }, [statusPower]);

    useEffect(() =>{
getSpeed();
        refreshToken();
    }, []);

    return(
        <div className="statusConn">

            <div className="topStatus">
                <div className="refresh">
                    <img src={refresh} alt="Refresh Arrow" className={loading === true? "arrow" : "arrowOff"} />
                </div>
            </div>
                        <div className="botSection">
                <div className="botStatus">
                    <div className="boxStatusCircle">
                        <h3>Connectivity</h3>
                        
                        <div className={ parseInt(sessionStorage.getItem('connNow')) === 1 ? "boxInternetActive" : "boxInternetInactive"}>

                        </div>
                    </div>
                    <div className="boxStatus">
                        <h3>Type</h3>

                        <div className="box">
                            <h4>{sessionStorage.getItem('typeNow')}</h4>
                        </div>
                    </div>
                    <div className="boxStatus">
                        <h3>Strength</h3>

                        <div className="box-bar">
                            <div className={bar1}>
                                
                            </div>
                            <div className={bar2}>
                                
                            </div>
                            <div className={bar3}>
                                
                            </div>
                            <div className={bar4}>
                                
                            </div>
                        </div>
                    </div>
                    <div className="boxStatus">
                        <h3>Flight Mode</h3>

                        <div className="boxPosition">
                            <h4>{sessionStorage.getItem('positionNow')}</h4>
                        </div>
                    </div>
                </div>
                <div className="speedStatus">
                    <div className="boxStatusSpeed">
                        <h3>Uplink</h3>
                        <div className="boxPositionSpeed">
			    <h4>{parseInt(sessionStorage.getItem('connNow')) !== 1 || speedNow.up_mbps === null || speedNow.up_mbps === undefined ? "----" : `${parseInt(speedNow.up_mbps)} Mbps`}</h4>
                        </div>
                    </div>
                    <div className="boxStatusSpeed">
                        <h3>Downlink</h3>
                        <div className="boxPositionSpeed">
			    <h4>{parseInt(sessionStorage.getItem('connNow')) !== 1 || speedNow.down_mbps === null || speedNow.down_mbps === undefined ? "----" : `${parseInt(speedNow.down_mbps)} Mbps`}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
