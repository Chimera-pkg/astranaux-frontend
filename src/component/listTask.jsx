import "../style/listTask.css"
import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faEraser, faCube } from '@fortawesome/free-solid-svg-icons';
import { DeleteTask } from "./task/deleteTaskPop";
import { UpdateTask } from "./task/updateTaskPop";
import { ConfirmProcess } from "./task/confirmProcess";
import React from 'react';
import baseUrl from '../config.jsx';


export const ListTask = ({handleClick, handleRefresh}) =>{

    const [tasks, setTasks] = useState([]);
    const [inactiveTasks, setInactiveTasks] = useState([]);
    const [token, setToken] = useState('');
    const [waypoint, setWaypoint] = useState([]);
    const [deletePop, setDelete] = useState(false);
    const [updatePop, setUpdate] = useState(false);
    const [confirmPop, setConfirm] = useState(false);
    const [dataUp, setData] = useState();
    const [emptyCheck, setEmpty] = useState(false);
    const [loadingList, setLoading] = useState(true);

    let numRow = 1;
    let numRowMob = 1;

    const cekKosong = () =>{
        if(inactiveTasks.filter( a => a.status === 0).length <=0){
            setEmpty(true);
        }
        else{
            setEmpty(false);
        }
    }

    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`);
            setToken(response.data.accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const axiosJWT = axios.create();

    const allTask = async() => {
        try {
            const response = await axiosJWT.get(`${baseUrl}/task`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(response.data);
            const inactiveTasks = response.data.filter(task => task.status === 0);
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

    const showDelete = (data) =>{
        setDelete(current=>!current);
        setData(data);
    }
    
    const showUpdate = (data) =>{
        setUpdate(current=>!current);
        setData(data);
    }

    const showConfirm = (data) =>{
        setConfirm(current=>!current);
        setData(data);
    }
    
    useEffect(() =>{
        refreshToken();
        allTask();
        allWaypoint();
    }, []);

    useEffect(() => {
        const inactiveTasks = tasks.filter(task => task.status !== 1);
        setInactiveTasks(inactiveTasks);
    }, [tasks]);

    useEffect(() =>{
        allTask();
        allWaypoint();
    }, [deletePop, updatePop, confirmPop, handleClick, handleRefresh]);


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
			            <th className="createAt">Created At</th>
                        <th className="actionButton">Action</th>
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

                        inactiveTasks
                    .filter( a => a.status === 0)
                    .map(task => (
                        <tr>
                            <td className="numberRow">{numRow++}</td>
                            <td className="idList">{task.id_task}</td>
                            <td className="nameList">{nameWaypoint(task.id_waypoints)}</td>
                            <td className={task.status === 2 ? "taskClear" : "taskProses"}><h5>{task.status === 2 ? "Done" : "Waiting"}</h5></td>
                            <td className={task.priority === 1 ? "priorityYes" : "priorityNo"}>{task.priority === 1 ? "True" : "False"}</td>
                            <td className="packageList">{task.package_code}</td>
			                <td className="createAt">{task.createdAt}</td>
                            <td className="actionButton">

                                {task.status === 2 ?  
                                    <div>
                                        <button className="editButton" onClick={() => showUpdate(task)}><FontAwesomeIcon icon={faPencil}/> Edit</button>
                                        <button className="deleteButton" onClick={() => showDelete(task)}><FontAwesomeIcon icon={faEraser}/> Delete</button>
                                    </div>

                                    : 

                                    <div>
                                        <button className="editButton" onClick={() => showUpdate(task)}><FontAwesomeIcon icon={faPencil}/> Edit</button>
                                        <button className="deleteButton" onClick={() => showDelete(task)}><FontAwesomeIcon icon={faEraser}/> Delete</button>
                                    </div>
                                }

                            </td>
                        </tr>
                    ))

                    }
                </tbody>
            </table>

            <div className="tabelMobileDelivery">
                {emptyCheck === true? 
                        <h2 className="emptyTeks deliveryEmpty">---Empty Waiting List---</h2>

                        :

                        inactiveTasks
                        .filter( a => a.status === 0)
                        .map(x => (
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
                                        <td className="rowValue">Waiting</td>
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
                                        <td className="titleRow">Action Button</td>
                                        <td className="rowValue">
                                            <button className="editButton" onClick={() => showUpdate(x)}><FontAwesomeIcon icon={faPencil}/> Edit</button>
                                            <button className="deleteButton" onClick={() => showDelete(x)}><FontAwesomeIcon icon={faEraser}/> Delete</button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                        ))
                }
                </div>

            {deletePop && 
                <DeleteTask handleClick={showDelete} data={dataUp} handleRefresh={handleRefresh}></DeleteTask>
            }

            {updatePop &&
                <UpdateTask handleClick={showUpdate} data={dataUp} nameWaypoint={waypoint} handleRefresh={handleRefresh}></UpdateTask>
            }
        </div>
    )
    
}
