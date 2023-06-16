import { Sidebar } from "../component/sidebar";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { WaypointsList } from "../component/waypointList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import "../style/waypoints.css";
import React from 'react';
import { AddWaypoints } from "../component/waypoints/addWaypoints";
import baseUrl from '../config.jsx';

export const Waypoints = () =>{

    const [activeInfoWindow, setActiveInfoWindow] = useState("");
    const [token, setToken] = useState('');
    const [center, setCenter] = useState();
    const [refreshCheck, setRefresh] = useState(false);
    const [isLoggedIn, setLogged] = useState(false);
    const [addWay, setAdd] = useState(false);
    const [waypoints, setWaypoints] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [loadingList, setLoading] = useState(true);

    // check user session function
    const checkSession = () =>{
        const sessionStatus = sessionStorage.getItem("userData");

        if(sessionStatus!==''){
            setLogged(true);
        }
        else{
            window.location.replace('/');
        }
    }

    // refresh data on change
    const handleRefresh = () =>{
        setRefresh(current=>!current);
    }

    const showAddWay = () =>{
        setAdd(current=>!current);
    }

    // get refresh token
    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`);
            setToken(response.data.accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const axiosJWT = axios.create();

    // get all waypoint data from table
    const allWaypoint = async() => {
        try {
            const response = await axios.get(`${baseUrl}/waypoints`);
            setWaypoints(response.data);
	    setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    // get coordinate based on latitude and longitude value
    const getCoordinate = () =>{
        if (waypoints.length > 0) {
	    const filteredWaypoints = waypoints.filter(item => item.status === 1);
            const initialMarkers = filteredWaypoints.map((item) => ({
            position: {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
            },
            label: { color: 'white', text: `${item.id}` },
            draggable: true,
          }));
          setMarkers(initialMarkers);
          setCenter(initialMarkers[0].position);
        }
      }

    const containerStyle = {
        width: "100%",
        height: "100%",
    }

    // get latitude and longitude value from user click
    const mapClicked = (event) => { 
        console.log(event.latLng.lat(), event.latLng.lng()) 
    }

    // set marker on click
    const markerClicked = (marker, index) => {  
        setActiveInfoWindow(index)
        console.log(marker, index) 
    }

    const markerDragEnd = (event, index) => { 
        console.log(event.latLng.lat())
        console.log(event.latLng.lng())
    }

    useEffect(() => {
        getCoordinate();
      }, [waypoints]);
    
    useEffect(() =>{
        refreshToken();
        allWaypoint();
    }, [refreshCheck]);

    useEffect(() =>{
        checkSession();
    }, []);

    return(
        <div className="waypointsMenu">
            {isLoggedIn &&
                <div>
                    <Sidebar></Sidebar>

                    <div className="waypointsContent">

                    <div className="topWaypoints">
                        <div className="titleWaypoints">
                            <h1>Waypoints</h1>
                            <h4>version 1.0</h4>
                        </div>
                    </div>

                    <div className="mapWaypoints">

                        <div className="mapView">
                            <GoogleMap 
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={20}
                                    onClick={mapClicked}
                                    googleMapsApiKey='AIzaSyCSaDQ0RmmHjpqhgCLXfx0IDHgVcrf1hl8'
                                >
                                    {markers.map((marker, index) => (
                                        <Marker 
                                            key={index} 
                                            position={marker.position}
                                            label={marker.label}
                                            draggable={marker.draggable}
                                            onDragEnd={event => markerDragEnd(event, index)}
                                            onClick={event => markerClicked(marker, index)} 
                                        >
                                            {
                                                (activeInfoWindow === index)
                                                &&
                                                <InfoWindow position={marker.position}>
                                                    <b>{marker.position.lat}, {marker.position.lng}</b>
                                                </InfoWindow>
                                            }  
                                        </Marker>
                                    ))}
                                </GoogleMap>
                        </div>                
                    </div>

                    <div className="listData">
                        <div className="listTitleWaypoint">
                            <h3>List Waypoint</h3>
                            <button className="buttonAddWay" onClick={showAddWay}>
                                <FontAwesomeIcon icon={faPlus}  className="logoAddWay"/>
                                <h4>Add New Waypoints</h4>
                            </button>
                        </div>
                        <WaypointsList waypoints={waypoints} handleRefresh={handleRefresh} loadingNow={loadingList}></WaypointsList>
                    </div>
                    </div>
                </div>
            }
             

             {addWay && <AddWaypoints handleClick={showAddWay} handleRefresh={handleRefresh}></AddWaypoints>}
        </div>
    )
}
