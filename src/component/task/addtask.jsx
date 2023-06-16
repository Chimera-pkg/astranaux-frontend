import "../../style/addtask.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { AddManual } from "./addMenu/addManual";
import { AddQR } from "./addMenu/addQR";
import React from 'react';

export const AddTask = ({handleClick}) =>{

    const [activeButton, setActive] = useState(true);
    const [activeManual, setManual] = useState(true);
    const [cameraAktif, setCamera] = useState(true);
    const [activeQR, setAuto] = useState(false);

    // add task methode to change menu manual or auto
    const changeActiveManual = () =>{
        setActive(current=>!current);
        setManual(true);
        setAuto(false);
    }

    const changeActiveAuto = () =>{
        setActive(current=>!current);
        setManual(false);
        setAuto(true);
    }

    // turn off camera after close addQR menu by state
    const handleCamera = () =>{
        setCamera(current=>!current);
    }

    const handleEvent = () =>{
        handleClick();
        handleCamera();
    }

    return(
        <div className="addTask">
            <div className="formTask">
                <button onClick={handleEvent} className="exit">
                    <FontAwesomeIcon icon={faXmark}  className="logoExit"/>
                </button>
                <div className="optionTask">
                    <div className="optionButton">
                        <button onClick={changeActiveManual} className={activeButton === true ? "activeButton" : "inactiveButton"}>Manual</button>
                        <button onClick={changeActiveAuto} className={activeButton === false ? "activeButton" : "inactiveButton"}>QR Scan</button>
                    </div>
                </div>

                <div className="mainContent">
                    {activeManual && <AddManual handleClick={handleEvent}></AddManual>}
                    {activeQR && <AddQR camera={handleCamera} handleClick={handleEvent}></AddQR>}
                </div>
            </div>
        </div>
    )
}