import "../../style/addtask.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import alert from "../../assets/alert.png";
import axios from "axios";
import React from 'react';
import baseUrl from '../../config.jsx';
export const DeleteTask = ({handleClick, data, handleRefresh}) =>{


    // delete task function based on id
    const deleteTask = async(e) =>{
        e.preventDefault();
        const id_task = data.id_task;

        try {
            const response = await axios.delete(`${baseUrl}/task/${id_task}`);
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
                    <h1>Are you sure want to <br/> delete the task?</h1>

                    <div className="buttonChoose">
                        <button className="yes" onClick={deleteTask}>Yes</button>
                        <button className="no" onClick={handleClick}>No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
