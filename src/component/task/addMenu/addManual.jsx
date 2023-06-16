import axios from "axios";
import { useEffect, useState } from "react";
import "../../../style/addInput.css";
import React from 'react';
import baseUrl from '../../../config.jsx';

export const AddManual = ({handleClick}) =>{

    const [waypoint, setWaypoint] = useState([]);
    const [token, setToken] = useState('');

    const [waypointVal, setWaypointVal] = useState('');
    const [priority, setPriority] = useState(null);
    const [packageCode, setPackage] = useState('');
    const [status, setStatus] = useState('0');

    // get refresh token function
    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`);
            setToken(response.data.accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const axiosJWT = axios.create();

    // get all waypoint data function
    const allWaypoint = async() => {
        const response = await axiosJWT.get(`${baseUrl}/waypoints`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        setWaypoint(response.data);
    }

    // add manual task function
    const addTaskManual = async (e) =>{
        e.preventDefault();
        
        try {
            const response = await axios.post(`${baseUrl}/task`,{
               id_waypoints: waypointVal,
               status: status,
               priority: priority,
               package_code: packageCode,
            });

            if(response.status === 200){
                handleClick();
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    // async function execution
    useEffect(() =>{
        allWaypoint();
        refreshToken();
    }, []);

    return(
        <div className="addManual">
            <form onSubmit={addTaskManual}>
                <table className="tabelAddManual">
                    <tr>
                        <td>
                            <h2 className="labelField">1. Waypoint Target</h2>
                            <select name="" id="" onChange={(e) => setWaypointVal(e.target.value)}>  
                                <option value="" disabled selected>Select your waypoint</option>
                                {waypoint
                                    .filter( a => a.status === 1)
                                    .filter( a => a.id !== 5)
                                    .map(x => (
                                        <option value={x.id}>{x.name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className="labelField">2. Priority Status</h2>
                            <select name="" id="" onChange={(e) => setPriority(e.target.value)}>
                                <option value="" disabled selected>Select priority</option>
                                <option value={1}>Yes</option>
                                <option value={0}>No</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2 className="labelField">3. Package Code</h2>
                            <input type="text" placeholder="Input Package Code" required="required" value={packageCode} onChange={(e) => setPackage(e.target.value)}/>
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
    )
}
