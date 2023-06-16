import React, { useEffect, useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import drone from "../assets/drone-loc.gif"

const MapComponent = () => {

    const [latitudeData, setLatitude] = useState(0);
    const [longitudeData, setLongitude] = useState(0);

    const [locationNow, setLocation] = useState([]);
    const [centerNow, setCenter] = useState({});

    useEffect(() => {
        const ws = new WebSocket('wss://www.astranaux.com');
    
        ws.onopen = () => {
            console.log("connected");
        };
    
        ws.onmessage = (event) => {
            const dataRaw = JSON.parse(event.data);
	    console.log('dataraw : ',dataRaw);
            const cleanData = dataRaw.message;
            const realData = JSON.parse(cleanData);
            setLatitude(parseFloat(realData.curr_lat));
            setLongitude(parseFloat(realData.curr_lon));
            
            sessionStorage.setItem('latitude', realData.curr_lat);
            sessionStorage.setItem('longitude', realData.curr_lon);
        };
    
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    
        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        const initialMarkers = [
            {
                position: {
                    lat: parseFloat(sessionStorage.getItem('latitude')),
                    lng: parseFloat(sessionStorage.getItem('longitude'))
                },
                label: { color: "white" },
                draggable: false,
                icon: {
                    url: drone,
                    scaledSize: new window.google.maps.Size(50, 50)
                  },
                
            },
        ];

        const center = {
            lat: parseFloat(sessionStorage.getItem('latitude')),
            lng: parseFloat(sessionStorage.getItem('longitude')),
        };

        setCenter(center);
        setMarkers(initialMarkers);
    }, [longitudeData, latitudeData]);
    
    const [activeInfoWindow, setActiveInfoWindow] = useState("");
    const [markers, setMarkers] = useState(locationNow);

    const containerStyle = {
        width: "100%",
        height: "100%",
    }  

    const mapClicked = (event) => { 
        console.log(event.latLng.lat(), event.latLng.lng()) 
    }

    const markerClicked = (marker, index) => {  
        setActiveInfoWindow(index)
        console.log(marker, index) 
    }

    const markerDragEnd = (event, index) => { 
        console.log(event.latLng.lat())
        console.log(event.latLng.lng())
    }

    const markerAnimation = {
        animation: window.google.maps.Animation.BOUNCE,
        duration: 300,
    };

    return (
                    <GoogleMap 
                        mapContainerStyle={containerStyle} 
                        center={centerNow} 
                        zoom={18}
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
                                animation={index === 0 ? markerAnimation : null}
                                icon={index === 0 ? marker.icon : null}
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
    );
};

export default MapComponent;
