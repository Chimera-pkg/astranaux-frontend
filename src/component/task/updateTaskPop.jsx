import "../../style/updateTask.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import axios from "axios";
import React from 'react';
import baseUrl from '../../config.jsx';

export const UpdateTask = ({handleClick, data, nameWaypoint, handleRefresh}) =>{

    const [waypointVal, setWaypointVal] = useState(data.id_waypoints);
    const [priority, setPriority] = useState(data.priority);
    const [packageCode, setPackage] = useState(data.package_code);
    const status = data.status;

    // get waypoint name function
    const name = idWay =>{
        for (const x of nameWaypoint) {
            if(x.id === idWay)
                return x.name;
        }
    }

    // update task data based on ID
    const updateTaskSubmit = async(e) =>{
        e.preventDefault();

        const id_task = data.id_task;

        try {
            const response = await axios.patch(`${baseUrl}/task/${id_task}`, {
                id_waypoints: waypointVal,
                status: status,
                priority: priority,
                package_code: packageCode,
            });

            if(response.status === 200){
                handleClick();
                handleRefresh();
            }
            
        } catch (error) {
            console.log(error.response.data);
        }
    }

    return(
        <div className="updateTask">
            <div className="formTask">
                <button onClick={handleClick} className="exit">
                    <FontAwesomeIcon icon={faXmark}  className="logoExit"/>
                </button>

                <div className="mainContent-update">
                    <h1>Edit Task</h1>
                    <form className="formUpdate" onSubmit={updateTaskSubmit}>
                        <table className="tabelEdit">
                            <tr>
                                <td>
                                    <h2 className="labelField">1. Waypoint Target</h2>
                                    <select name="" id="" onChange={(e) => setWaypointVal(e.target.value)} defaultValue={data.id_waypoints}>
                                        
                                        <option value={data.id_waypoints} selected>{name(data.id_waypoints)}</option>
                                        
                                        {nameWaypoint
					.filter( a => a.status === 1)
                                        .filter( a => a.name !== 'homebase')
                                        .filter( a => a.id !== data.id_waypoints)
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
                                        <option value={data.priority} selected>{data.priority === 1 ? "Yes" : "No"}</option>
                                        <option value={1}>Yes</option>
                                        <option value={0}>No</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h2 className="labelField">3. Package Code</h2>
                                    <input type="text" placeholder="Input Package Code" required="required" defaultValue={data.package_code} onChange={(e) => setPackage(e.target.value)}/>
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
