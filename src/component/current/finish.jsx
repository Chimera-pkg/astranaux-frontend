import "../../style/addtask.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import alert from "../../assets/alert.png";
import axios from "axios";
import React from 'react';
import baseUrl from '../../config.jsx';

export const FinishProcess = ({handleClick, data, handleRefresh}) =>{

    const updateStatus = async(e) =>{
        e.preventDefault();

        const id_task = data.id_task;

        // update task status = 2 base on ID
        try {
            const response = await axios.patch(`${baseUrl}/task/${id_task}`, {
                status: 2,
            });

            if(response.status === 200){
                // run refresh and pop up close function
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
                    <h1>Are you sure want to <br/> finish ID {data.id_task} delivery?</h1>

                    <div className="buttonChoose">
                        <button className="yes" onClick={updateStatus}>Yes</button>
                        <button className="no" onClick={handleClick}>No</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
