import "../../style/addWaypoints.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';
import baseUrl from '../../config.jsx';

export const AddWaypoints = ({handleClick, handleRefresh}) =>{

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [altitude, setAltitude] = useState('');
    const [status, setStatus] = useState('');
    const [markers, setMarkers] = useState([]);
    const [activeInfoWindow, setActiveInfoWindow] = useState("");

    const addWaypoints = async(e) =>{
        e.preventDefault();

        try {
            const response = await axios.post(`${baseUrl}/waypoints`, {
                name: name,
                code: code,
                latitude: latitude,
                longitude: longitude,
                altitude: altitude,
                status: status,
            });

            if(response.status === 200){
                handleRefresh();
                handleClick();
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    // set marker on click
    const markerClicked = (marker, index) => {  
        setActiveInfoWindow(index)
        console.log(marker, index) 
    }


    const center = {
        lat: -6.349068157043364,
        lng: 107.14958507799281,
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

    return(
        <div className="updateTask">
            <div className="formTask">
                <button onClick={handleClick} className="exit">
                    <FontAwesomeIcon icon={faXmark}  className="logoExit"/>
                </button>

                <div className="mainContent-update">
                    <h1>Add New Waypoints</h1>
                    <form className="formAddWay" onSubmit={addWaypoints}>
                        <table className="tabelEdit">
                            <div className="locationCoordinate">
                                <tr className="latInput">
                                    <td>
                                    <h2 className="labelField labelWay">1. Waypoint Name</h2>
                                        <input type="text" placeholder="Input Name" required="required" onChange={(e) => setName(e.target.value)}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    <h2 className="labelField labelWay">2. Waypoint Code</h2>
                                        <input type="text" placeholder="Input Code" required="required" onChange={(e) => setCode(e.target.value)}/>
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
                                    <input type="text" placeholder="Input Altitude" required="required" onChange={(e) => setAltitude(e.target.value)}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <h2 className="labelField labelWay">6. Status</h2>
                                    <select name="" id="" onChange={(e) => setStatus(e.target.value)}>
                                        <option value="" disabled selected>Select status</option>
                                        <option value={1}>Active</option>
                                        <option value={0}>Disabled</option>
                                    </select>
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
