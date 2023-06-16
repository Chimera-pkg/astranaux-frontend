import "../../style/addtask.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import alert from "../../assets/alert.png";
import axios from "axios";
import React from 'react';
import baseUrl from '../../config.jsx';

export const ConfirmProcess = ({handleClick, listTask, waypoint}) =>{

    // filter to get 3 top task information based on status and oldest
    const listWaiting = listTask.filter(task => task.status === 0);
    const topThree = listWaiting.slice(0, 2);

    // get waypoint name function
    const nameWaypoint = idWay =>{
        for (const x of waypoint) {
            if(x.id === idWay)
                return x.name;
        }
    }

    // update task status function to launch
    const updateStatus = async(e) =>{
        e.preventDefault();

        try {
            const response = await axios.post(`${baseUrl}/launch`);

            if(response.status === 200){
                handleClick();
            }

        } catch (error) {
            console.log(error.response.data);
        }
    }

    return(
        <div className="addTask">
            <div className="formDelete">
                <button onClick={handleClick} className="exit">
                    <FontAwesomeIcon icon={faXmark}  className="logoExit"/>
                </button>

                <div className="mainContent-delete">
                    <img src={alert} alt="" />
                    <h1>Are you sure want to <br/> launch this mission?</h1>

                    <table className="launchList">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Waypoint Name</th>
                                <th>Package Code</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            topThree
                            .map(x =>(
                                <tr>
                                    <td className="launchID">{x.id_task}</td>
                                    <td className="launchName">{nameWaypoint(x.id_waypoints)}</td>
                                    <td className="launchCode">{x.package_code}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>

                    <div className="buttonChoose">
                        <button className="yes" onClick={updateStatus}>Yes</button>
                        <button className="no" onClick={handleClick}>No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
