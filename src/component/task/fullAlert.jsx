import "../../style/addtask.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import alert from "../../assets/alert.png";
import React from 'react';

export const FullAlert = ({handleClick}) =>{

    return(
        <div className="addTask">
            <div className="formDelete">
                <button onClick={handleClick} className="exit">
                    <FontAwesomeIcon icon={faXmark}  className="logoExit"/>
                </button>

                <div className="mainContent-delete">
                    <img src={alert} alt="" />
                    <h1>Current Mission Full<br/>Please Wait Until Finished</h1>

                    <div className="buttonChooseAlert">
                        <button className="yesAlert" onClick={handleClick}>Okay</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
