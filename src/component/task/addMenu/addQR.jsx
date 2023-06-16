import React, { useEffect, useRef, useState } from "react";
import "../../../style/addInput.css";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import axios from "axios";

import baseUrl from '../../../config.jsx';

export const AddQR = ({handleClick}) =>{
    const webcamRef = useRef(null);
    const [idWay, setId] = useState('');
    const [packageCode, setPackage] = useState('');
    const [priority, setPriority] = useState('');
    const [scanStatus, setScan] = useState(false);
    const [errorText, setError] = useState();

    // Fungsi untuk membaca QR code dari gambar
    const readQrCode = React.useCallback(
        (imageData) => {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                setScan(true);
                const arr = code.data;
                const split_arr = arr.split('|');
                setId(split_arr[0]);
                setPackage(split_arr[1]);
                setPriority(split_arr[2]); 
            }
        },
        []
    );

    // add task function based on QR result
    const addTaskAuto = async (e) =>{
        e.preventDefault();
        
        try {
            if(priority === "1"  || priority === "0"){
                setError("");
                const response = await axios.post('https://astranaux.com/task',{
                    id_waypoints: idWay,
                    status: 0,
                    priority: priority,
                    package_code: packageCode,
                });

                if(response.status === 200){
                    handleClick();
                    setError("");
                }
            }
            else{
                setError("Invalid Priority Status!");
            }
        } catch (error) {
            if(error.response.status===500){
                setError("Invalid Waypoint ID!");
            }
        }
    }

    // reset scan result
    const cancelScan = () =>{
	setError("");
        setScan(false);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const image = new Image();
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    if(scanStatus===false){
                        readQrCode(imageData);
                    }
                    else if(scanStatus===true){
                        // console.log("halloo");
                    }
                };
                image.src = imageSrc;
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
        };
    }, [readQrCode]);

    return(
        <div className="addQR">
            <div className="scanQR">
                <Webcam className="cameraWeb" ref={webcamRef}></Webcam>
            </div>

            <div className="cameraButton">

                {!scanStatus && <button className="refreshCameraButton"> <div className="loaderCamera"></div> </button>}
                {scanStatus && <div className="formConfirm">

                    <h3>Data Result</h3>

                    <form action="" onSubmit={addTaskAuto}>
                        <table className="tabelQR">
                            <tr>
                                <td className="titleQR">Waypoint ID</td>
                                <td className="split">:</td>
                                <td><input type="text" value={idWay}/></td>
                            </tr>
                            <tr>
                                <td className="titleQR">Package Code</td>
                                <td className="split">:</td>
                                <td><input type="text" value={packageCode}/></td>
                            </tr>
                            <tr>
                                <td className="titleQR">Priority Status</td>
                                <td className="split">:</td>
                                <td><input type="text" value={priority}/></td>
                            </tr>
                        </table>

                        <div className="buttonAddQR">
                            <button className="addConfirm" type="submit">Add Task</button>
                            <button className="cancelConfirm" onClick={cancelScan}>Cancel</button>
                        </div>
                    </form>
		    <h4 className="textError">{errorText}</h4>
                </div> }
                
            </div>
        </div>
    )
}
