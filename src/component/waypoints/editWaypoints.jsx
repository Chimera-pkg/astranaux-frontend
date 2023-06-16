import "../../style/addWaypoints.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import axios from "axios";
import React from 'react';
import baseUrl from '../../config.jsx';

export const EditWaypoints = ({handleClick, data, handleRefresh}) =>{
    
    const [name, setName] = useState();
    const [code, setCode] = useState();
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [altitude, setAltitude] = useState();
    const [markers, setMarkers] = useState([]);

    const editWaypoints = async(e) =>{
        e.preventDefault();

        const idnya = data.id;

        try {
            const response = await axios.patch(`${baseUrl}/waypoints/${idnya}`, {
                name: name,
                code: code,
                latitude: latitude,
                longitude: longitude,
                altitude: altitude,
                status: data.status,
            });

            if(response.status === 200){
                handleClick();
                handleRefresh();
            }


        } catch (error) {
            console.log(error.response.data);
        }
    }

    const markNow = () =>{
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        setLongitude(lng);
        setLatitude(lat);

        setMarkers([{lat, lng}]);
    }

    const center = {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
    };

    const containerStyle = {
        width: "100%",
        height: "100%",
    }

    const markerDragEnd = (event, index) => { 
        console.log(event.latLng.lat())
        console.log(event.latLng.lng())
    }

    const mapClicked = (event) => { 
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newMarker = { lat, lng };
        console.log(event.latLng.lat(), event.latLng.lng()) 
        setMarkers([newMarker]);
        setLatitude(lat);
        setLongitude(lng);
    }

    useEffect(()=>{
        markNow();
    },[])

    return(
        <div className="updateTask">
            <div className="formTask">
                <button onClick={handleClick} className="exit">
                    <FontAwesomeIcon icon={faXmark}  className="logoExit"/>
                </button>

                <div className="mainContent-update">
                    <h1>Edit Waypoints</h1>
                    <form className="formAddWay " onSubmit={editWaypoints}>
                        <table className="tabelEdit">
                            <div className="locationCoordinate">
                                <tr className="latInput">
                                    <td>
                                    <h2 className="labelField labelWay">1. Waypoint Name</h2>
                                        <input type="text" placeholder="Input Name" required="required" defaultValue={data.name} onChange={(e) => setName(e.target.value)} readOnly={data.code === "1001" ? true : false}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    <h2 className="labelField labelWay">2. Waypoint Code</h2>
                                        <input type="text" placeholder="Input Code" required="required" defaultValue={data.code} onChange={(e) => setCode(e.target.value)} readOnly={data.code === "1001" ? true : false}/>
                                    </td>
                                </tr>
                            </div>
                            <tr className="mapRow">
                                <td className="mapAddWaypoint">
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={markers.length > 0 ? markers[0] : center}
                                    zoom={18}
                                    onClick={mapClicked}
                                >
                                    {markers.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        position={{ lat: marker.lat, lng: marker.lng }}
                                        draggable={true}
                                        onDragEnd={(event) => markerDragEnd(event, index)}
                                    />
                                    ))}
                                </GoogleMap>
                                </td>
                            </tr>
                            <div className="locationCoordinate">
                                <tr className="latInput">
                                    <td>
                                    <h2 className="labelField labelWay">3. Latitude Value</h2>
                                        <input type="text" placeholder="Input Latitude" required="required" value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
                                    </td>
                                </tr>
                                <tr className="lonInput">
                                    <td>
                                    <h2 className="labelField labelWay">4. Longitude Value</h2>
                                        <input type="text" placeholder="Input Longitude" required="required" value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
                                    </td>
                                </tr>
                            </div>
                            <tr>
                                <td>
                                <h2 className="labelField labelWay">5. Altitude Value</h2>
                                    <input type="text" placeholder="Input Altitude" required="required" defaultValue={data.altitude} onChange={(e) => setAltitude(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td className="buttonSection">
                                    <input type="submit" name="" id="" />
                                    <button className="cancelButton" onClick={handleClick}>Cancel</button>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    )
}
