import "../style/listTask.css"
import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react';
// import jwt_decode from "jwt-decode";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPencil, faEraser, faCube, faSortUp, faSortDown  } from '@fortawesome/free-solid-svg-icons';
import baseUrl from '../config.jsx';

export const HistoryTask = ({handleClick, handleRefresh}) =>{

    const [tasks, setTasks] = useState([]);
    const [inactiveTasks, setInactiveTasks] = useState([]);
    const [token, setToken] = useState('');
    const [waypoint, setWaypoint] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('id_task');
    const [sortOrder, setSortOrder] = useState('asc');
    const [emptyCheck, setEmpty] = useState(false);
    const [loadingList, setLoading] = useState(true);

    let numRow = 1;
    let numRowMob = 1;

    const cekKosong = () =>{
        if(inactiveTasks.length <=0){
            setEmpty(true);
        }
        else{
            setEmpty(false);
        }
    }

    const allTask = async() => {
        try {
            const response = await axios.get(`${baseUrl}/task`);
            setTasks(response.data);
            const inactiveTasks = response.data.filter(task => task.status === 3);
            if(inactiveTasks.length>0){
                setLoading(false);
            }
            else{
                setEmpty(true);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const allWaypoint = async() => {
        try {
            const response = await axios.get(`${baseUrl}/waypoints`);
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

    useEffect(() =>{
        allTask();
        allWaypoint();
    }, []);

    useEffect(() => {
        const inactiveTasks = tasks.filter(task => task.status === 3);
        setInactiveTasks(inactiveTasks);
    }, [tasks]);

    useEffect(() =>{
        allTask();
        allWaypoint();
    }, [ handleClick, handleRefresh]);

    return(
        <div className="listTaskDelivery">

            <table className="tabelDekstopDelivery">
                <thead>
                    <tr>
                        <th className="numberRow">No</th>
                        <th className="idList">ID</th>
                        <th className="nameList">Waypoints</th>
                        <th className="taskProses">Status</th>
                        <th className="priorityYes">Priority</th>
                        <th className="packageList">Package Code</th>
			            <th className="createAt">Launch Time</th>
                        <th className="actionButton">Finished Time</th>
                    </tr>
                </thead>
            
                <tbody>
                    {loadingList === true? 
                    <div className="loaderLogin listLoader"></div>
                    :
			emptyCheck === true? 
                        <tr>
                            <td className="emptyTeks" colSpan={8}><h2>Empty</h2></td>
                        </tr>

                        :
                        
                        inactiveTasks.map((task) => (
                            <tr key={task.id_task}>
                                <td className="numberRow">{numRow++}</td>
                                <td className="idList">{task.id_task}</td>
                                <td className="nameList">{nameWaypoint(task.id_waypoints)}</td>
                                <td className="taskClear">
                                <h5>Clear</h5>
                                </td>
                                <td className={task.priority === 1 ? 'priorityYes' : 'priorityNo'}>
                                {task.priority === 1 ? 'True' : 'False'}
                                </td>
                                <td className="packageList">{task.package_code}</td>
                                <td className="createAt">{task.launchedAt}</td>
                                <td className="finishedTime">{task.finishedAt}</td>
                    
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div className="tabelMobileDelivery">
                {emptyCheck === true? 
                        <h2 className="emptyTeks deliveryEmpty">---Empty History List---</h2>

                        :

                        inactiveTasks.map(x => (
                            <div className="dataRow">
                                <table>
                                    <tr>
                                        <td className="titleRow">No</td>
                                        <td className="rowValue">{numRowMob++}</td>
                                    </tr>
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
                                        <td className="rowValue">Clear</td>
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
                                        <td className="titleRow">Create At</td>
                                        <td className="rowValue">{x.createdAt}</td>
                                    </tr>
                                    <tr>
                                        <td className="titleRow">Finish Time</td>
                                        <td className="rowValue">{x.finishedAt}</td>
                                    </tr>
                                </table>
                            </div>  
                        ))
                }
                </div>
        </div>
    )
}
