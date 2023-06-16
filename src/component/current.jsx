import "../style/current.css";
import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FinishProcess } from "./current/finish";
import { CancelProcess } from "./current/cancel";
import baseUrl from '../config.jsx';

export const CurrentMission = () =>{

    const [dataUp, setData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [waypoint, setWaypoint] = useState([]);
    const [tasksActive, setTasksActive] = useState([]);
    const [refreshList, setRefresh] = useState(false);
    const [cancelPop, setCancel] = useState(false);
    const [finishPop, setFinish] = useState(false);
    const [token, setToken] = useState('');
    const [loadingList, setLoading] = useState(true);

    const [emptyCheck, setEmpty] = useState(false);

    const axiosJWT = axios.create();

    const handleRefreshnya = () =>{
        setRefresh(current=>!current);
    }

    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`);
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const allTask = async() => {
        try {
            const response = await axiosJWT.get('https://www.astranaux.com/task', {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(response.data);
            const activeTasks = response.data.filter(task => task.status === 1 || task.status === 2);
            if(activeTasks.length>0){
                setLoading(false);
            }
            else{
                setLoading(false);
                setEmpty(true);
            }
        } catch (error) {
            
        }
    }

    const allWaypoint = async() => {
        try {
            const response = await axiosJWT.get(`${baseUrl}/waypoints`);
            setWaypoint(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const nameWaypoint = idWay =>{
        for (const x of waypoint) {
            if(x.id === idWay)
                return x.name;
        }
    }

    const showCancel = (data) =>{
        setCancel(current=>!current);
        setData(data);
    }

    const showFinish = (data) =>{
        setFinish(current=>!current);
        setData(data);
    }
    
    useEffect(() =>{
        refreshToken();
        allTask();
        allWaypoint();
 }, []);

    useEffect(() => {
        const activeTasks = tasks.filter(task => task.status === 1 || task.status === 2);
        setTasksActive(activeTasks);
    }, [tasks]);

    useEffect(() =>{
        allTask();
        allWaypoint();
    }, [refreshList]);


    return(
        <div className="currentMission">
            <h3>Current Mission</h3>

            <table className="currentTable">
                <thead className="titleDekstop">
                    <tr>
                        <th className="idListCurrent">ID</th>
                        <th className="nameListCurrent">Waypoint</th>
                        <th className="taskProsesCurrent">Status</th>
                        <th className="priorityCurrent">Priority</th>
                        <th className="packageCurr">Package Code</th>
                        <th className="launchAt">Launch At</th>
                        <th className="actionButtonCurrent">Action</th>
                    </tr>
                </thead>
                <tbody className="tabelDekstop">
                    {loadingList === true? 
                    <div className="loaderLogin listLoader"></div>
                    :
			emptyCheck === true? 
                        <tr>
                            <td className="emptyTeks" colSpan={7}><h2>Empty</h2></td>
                        </tr>

                        :
                            tasksActive.map(x => (
                                <tr>
                                    <td className="idListCurrent">{x.id_task}</td>
                                    <td className="nameListCurrent">{nameWaypoint(x.id_waypoints)}</td>
                                    <td className={x.status === 1? "taskProsesCurrent" : "taskOnAir"}><h5>{x.status === 1? "Process" : "On Air"}</h5></td>
                                    <td className="priorityCurrent">{x.priority === 1 ? "True" : "False"}</td>
                                    <td className="packageCurr">{x.package_code}</td>
				    <td className="launchedAt">{x.launchedAt}</td>
                                    <td className="actionButtonCurrent">
                                        { x.status === 1? 
                                            <button className="cancelTaskButtonCurrent" onClick={() => showCancel(x)}><FontAwesomeIcon icon={faXmark} className="iconX"/> <h6>Abort Mission</h6></button>
                                            :
                                            <div className="disabledCancel">
                                                <h2>---</h2>
                                            </div>
                                        }
                                    {/* <button className="finishedButton" onClick={() => showFinish(x)}><FontAwesomeIcon icon={faFlagCheckered}/> Finished</button>*/}
                                    </td>
                                </tr> 
                            ))
                    }
                    
                </tbody>
            </table>

            <div className="tabelMobile">
                    {emptyCheck === true? 
                        <h2 className="emptyTeks">---Empty List---</h2>

                        :

                        tasksActive.map(x => (
                            <div className="dataRow">
                                <table>
                                    <tr>
                                        <td className="titleRow">ID Mission</td>
                                        <td className="rowValue">{x.id_task}</td>
                                    </tr>
                                    <tr>
                                        <td className="titleRow">Name Mission</td>
                                        <td className="rowValue">{nameWaypoint(x.id_waypoints)}</td>
                                    </tr>
                                    <tr>
                                        <td className="titleRow">Status</td>
                                        <td className="rowValue"><h5 className={x.status === 1? "prosesRow" : "airRow"}>{x.status === 1? "Process" : "On Air"}</h5></td>
                                    </tr>
                                    <tr>
                                        <td className="titleRow">Priority</td>
                                        <td className="rowValue">{x.priority === 1 ? "True" : "False"}</td>
                                    </tr>
                                    <tr>
                                        <td className="titleRow">Package Code</td>
                                        <td className="rowValue">{x.package_code}</td>
                                    </tr>
                                    <tr>
                                        <td className="titleRow">Action Button</td>
                                        <td className="rowValue">
                                        { x.status === 1? 
                                            <button className="cancelTaskMobile" onClick={() => showCancel(x)}><h6>Abort Mission</h6></button>
                                            :
                                            <div className="disabledCancel">
                                                <h2>---</h2>
                                            </div>
                                        }
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                        ))
                    }
                </div>

            {cancelPop &&
                <CancelProcess handleClick={showCancel} data={dataUp} handleRefresh={handleRefreshnya}></CancelProcess>
            }

            {finishPop &&
                <FinishProcess handleClick={showFinish} data={dataUp} handleRefresh={handleRefreshnya}></FinishProcess>
            }
        </div>
    )
}
