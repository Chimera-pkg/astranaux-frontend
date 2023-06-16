import "../../style/addtask.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import alert from "../../assets/alert.png";
import axios from "axios";
import { useState } from "react";
import React from 'react';
import baseUrl from '../../config.jsx';

export const DeleteWay = ({ handleClick, data, handleRefresh}) =>{

    const [status, setStatus] = useState();

    const deleteTask = async(e) =>{
        e.preventDefault();

        const statusnya = data.status === 1? 0 : 1;

        try {
            const response = await axios.patch(`${baseUrl}/waypoints/${data.id}`, {
                name: data.name,
                code: data.code,
                latitude: data.latitude,
                longitude: data.longitude,
                altitude: data.altitude,
                status: statusnya,
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
        <div className="addTask">
            <div className="formDelete">
                <button onClick={handleClick} className="exit">
                    <FontAwesomeIcon icon={faXmark}  className="logoExit"/>
                </button>
                <div className="mainContent-delete">
                    <img src={alert} alt="" />
                    <h1>Are you sure want to <br/> disabled this waypoints?</h1>

                    <div className="buttonChoose">
                        <button className="yes" onClick={deleteTask}>Yes</button>
                        <button className="no" onClick={handleClick}>No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
