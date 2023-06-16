import "../style/waypoints.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faEraser } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { DeleteWay } from "./waypoints/deleteWaypoint";
import { EditWaypoints } from "./waypoints/editWaypoints";
import React from 'react';

export const WaypointsList = ({waypoints, handleRefresh, loadingNow}) =>{

    const [delWay, setDelete] = useState(false);
    const [editWay, setEdit] = useState(false);
    const [data, setData] = useState('');

    const showDelete = (x) =>{
        setDelete(current=>!current);
        setData(x);
    }

    const showEdit = (x) =>{
        setEdit(current=>!current);
        setData(x);
    }

    return(
        <div className="listWaypoints">
            <table className="tabelDekstopWaypoint">
                <thead>
                    <tr>
                        <th className="idWay">ID</th>
                        <th className="nameWay">Name</th>
                        <th className="codeWay">Code</th>
                        <th className="latWay">Latitude</th>
                        <th className="lonWay">Longitude</th>
                        <th className="altWay">Altitude</th>
                        <th className="statusWay">Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {loadingNow === true? 
                    <div className="loaderLogin listLoader"></div>
                    :
			waypoints.map(x => (
                        <tr>
                            <td className="idWay">{x.id}</td>
                            <td>{x.name}</td>
                            <td>{x.code}</td>
                            <td>{x.latitude}</td>
                            <td>{x.longitude}</td>
                            <td>{x.altitude} m</td>
                            <td className={x.status === 1 ? "activeStatus" : "inactiveStatus"}><h5>{x.status === 1 ? "Active" : "Inactive"}</h5></td>
                            <td className="actionButtonWay">
                                {x.id === 5 ?
                                    <div>
                                        <button className="editButtonWay" onClick={() => showEdit(x)}><FontAwesomeIcon icon={faPencil}/> Edit</button>
                                    </div>

                                    :

                                    <div>
                                        <button className={x.status===1? "deleteButtonWay" : "enabledButton"} onClick={() => showDelete(x)}><FontAwesomeIcon icon={faEraser}/> {x.status === 1 ? "Disabled" : "Enabled"}</button>
                                        <button className="editButtonWay" onClick={() => showEdit(x)}><FontAwesomeIcon icon={faPencil}/> Edit</button>
                                    </div>   
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="tabelMobileWaypoint">
                    {waypoints.map(x => (
                        <div className="dataRow">
                            <table>
                                <tr>
                                    <td className="titleRow">ID Waypoint</td>
                                    <td className="rowValue">{x.id}</td>
                                </tr>
                                <tr>
                                    <td className="titleRow">Name</td>
                                    <td className="rowValue">{x.name}</td>
                                </tr>
                                <tr>
                                    <td className="titleRow">Code</td>
                                    <td className="rowValue">{x.code}</td>
                                </tr>
                                <tr>
                                    <td className="titleRow">Latitude</td>
                                    <td className="rowValue">{x.latitude} m</td>
                                </tr>
                                <tr>
                                    <td className="titleRow">Longitude</td>
                                    <td className="rowValue">{x.longitude}</td>
                                </tr>
                                <tr>
                                    <td className="titleRow">Altitude</td>
                                    <td className="rowValue">{x.altitude}</td>
                                </tr>
                                <tr>
                                    <td className="titleRow">Status</td>
                                    <td className={x.status === 1 ? "rowValueActive" : "rowValueInactive"}><h5>{x.status === 1 ? "Active" : "Inactive"}</h5></td>
                                </tr>
                                <tr>
                                    <td className="titleRow">Action Button</td>
                                    <td className="rowValue">
                                        {x.code === "1001" ?
                                            <div>
                                                <button className="editButtonWay" onClick={() => showEdit(x)}><FontAwesomeIcon icon={faPencil}/> Edit</button>
                                            </div>

                                            :

                                            <div>
                                                <button className={x.status===1? "deleteButtonWay" : "enabledButton"} onClick={() => showDelete(x)}><FontAwesomeIcon icon={faEraser}/> {x.status === 1 ? "Disabled" : "Enabled"}</button>
                                                <button className="editButtonWay" onClick={() => showEdit(x)}><FontAwesomeIcon icon={faPencil}/> Edit</button>
                                            </div>   
                                        }
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                    ))}
                </div>

            {delWay && <DeleteWay handleClick={showDelete} data={data} handleRefresh={handleRefresh}></DeleteWay>}
            {editWay && <EditWaypoints handleClick={showEdit} data={data} handleRefresh={handleRefresh}></EditWaypoints>}
        </div>
    )
}
