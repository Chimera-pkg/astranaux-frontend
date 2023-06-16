import React, { useEffect, useState } from "react";
import "../style/location.css";
import MapComponent from "./map";

export const LocationDrone = () =>{

    const [altitudeNow, setAltitude] = useState(0);

    useEffect(() => {
        const ws = new WebSocket('wss://astranaux.com');
    
        ws.onopen = () => {
            // console.log("connected");
        };
    
        ws.onmessage = (event) => {
            const dataRaw = JSON.parse(event.data);
            const cleanData = dataRaw.message;
            const realData = JSON.parse(cleanData);
            setAltitude(parseFloat(realData.curr_alt));
        };
    
        ws.onclose = () => {
            // console.log('WebSocket connection closed');
        };
    
        return () => {
            ws.close();
        };
    }, []);

    return(
        <div className="droneLocation">
            <div className="viewDrone">
                <h3>Drone View</h3>

                <div className="viewVideo">
                    <img className="myVideo" src="https://stream2.astranaux.tech/video_feed" alt="Video Not Found"></img>
                </div>
            </div>
            <div className="viewMap">
                 <div className="titleMapDrone">
                    <h3>Drone Location</h3>
                    <h4 className="curr_alt">Alt : {altitudeNow} m</h4>
                </div>

                 <div className="viewLocation">
                    <MapComponent></MapComponent>
                 </div>
            </div>
        </div>
    )
}
