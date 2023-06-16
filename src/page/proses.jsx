import "../style/order.css";
import { Sidebar } from "../component/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRocket } from '@fortawesome/free-solid-svg-icons';
import { ListTask } from "../component/listTask";
import { useEffect, useState } from "react";
import { ConfirmProcess } from "../component/task/confirmProcess";
import { AddTask } from "../component/task/addtask";
import { HistoryTask } from "../component/historyTask";
import { FullAlert } from "../component/task/fullAlert";
import axios from "axios";
import React from 'react';
import baseUrl from '../config.jsx';
export const OrderProcess = () =>{

    const [tasks, setTasks] = useState([]);
    const [waypoint, setWaypoint] = useState([]);
    const [tasksActive, setTasksActive] = useState('');
    const [token, setToken] = useState('');

    const [isLoggedIn, setLogged] = useState(false);
    const [menuAdd, setMenuAdd] = useState(false);
    const [fullMission, setFull] = useState(false);
    const [refreshCheck, setRefresh] = useState(false);
    const [launchMission, setLaunch] = useState(false);

    const axiosJWT = axios.create();

    // check user session function
    const checkSession = () =>{
        const sessionStatus = sessionStorage.getItem("userData");

        if(sessionStatus!==''){
            setLogged(true)
        }
        else{
            window.location.replace('/');
        }
    }

    // get refresh token function
    const refreshToken = async() => {
        try {
            const response = await axios.get(`${baseUrl}/token`);
            setToken(response.data.accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    // get all task from table
    const allTask = async() => {
        const response = await axiosJWT.get(`${baseUrl}/task`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        setTasks(response.data);
        
    }

    // get all waypoint from table
    const allWaypoint = async() => {
        try {
            const response = await axiosJWT.get(`${baseUrl}/waypoints`);
            setWaypoint(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // filter task by status 1 / 2 which is on queue or on air
    useEffect(() => {
        const activeTasks = tasks.filter(task => task.status === 1 || task.status === 2);
        setTasksActive(activeTasks.length);
    }, [tasks]);
    
    // async function execution
    useEffect(() => {
        refreshToken();
        allTask();
        allWaypoint();
    }, []);
    
    // refresh and pop up close function
    const handleChange = () =>{
        setMenuAdd(current=>!current);
    }

    const handleRefresh = () =>{
        setRefresh(current=>!current);
    }

    // check current mission full or not
    const handleMission = () =>{
        if(tasksActive>=1){
            setFull(current=>!current);
        }
        else{
            setLaunch(current=>!current);
        }
    }

    useEffect(() =>{
        checkSession();
    }, []);

    return(
        <div className="prosesOrder">
            {isLoggedIn &&
                <div>
                    <Sidebar></Sidebar>

                    <div className="contentOrder">
                        <div className="titleOrder">
                            <h1>Delivery</h1>
                            <h4>version 1.0</h4>

                            <button className="buttonLaunch" onClick={handleMission} handleRefresh={handleRefresh}>
                                <FontAwesomeIcon icon={faRocket}  className="logoLaunch"/>
                                <h4>Launch Mission</h4>
                            </button>
                        </div>
        
                        <div className="orderList">
                            <div className="addOrder">
                                <h3>Waiting List</h3>

                                <div className="buttonAction">
                                    <button className="buttonAdd" onClick={handleChange} handleRefresh={handleRefresh}>
                                        <FontAwesomeIcon icon={faPlus}  className="logoAdd"/>
                                        <h4>Add New Task</h4>
                                    </button>
                                </div>
                            </div>

                            <ListTask handleClick={handleChange} handleRefresh={handleRefresh}></ListTask>

                            <div className="addOrder">
                                <h3>Mission History</h3>
                            </div>

                            <HistoryTask handleClick={handleChange} handleRefresh={handleRefresh}></HistoryTask>
                        
                        </div>
                    </div>
                </div>
            }
            

                    {menuAdd && 
                    
                    <div>
                        <AddTask handleClick={handleChange} handleRefresh={handleRefresh}></AddTask>
                    </div>

                    }

                    {launchMission &&
                        <div>
                            <ConfirmProcess handleClick={handleMission} listTask={tasks} waypoint={waypoint}></ConfirmProcess>
                        </div>
                    }

                    {fullMission &&
                        <div>
                            <FullAlert handleClick={handleMission}></FullAlert>
                        </div>
                    }
        </div>
    )
}
