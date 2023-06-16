import { LoginPage } from './page/login';
import{ Route, Routes } from "react-router-dom";
import { Dashboard } from './page/main';
import { Waypoints } from './page/waypoints';
import { OrderProcess } from './page/proses';
import { LoadScript } from '@react-google-maps/api';
import { Register } from './page/register';
import PrivateRoute from './middleware/routeAccess';
import useAuth from './middleware/routeAccess';
import React from 'react';
function App() {
  
  return (
    <div className="App">
      <LoadScript googleMapsApiKey='AIzaSyCSaDQ0RmmHjpqhgCLXfx0IDHgVcrf1hl8'>
      <Routes>
        <Route path='/' element={ <LoginPage /> } ></Route>
        <Route path='/dashboard' element={ <Dashboard /> } ></Route>
        <Route path='/waypoint' element={ <Waypoints /> } ></Route>
        <Route path='/delivery' element={ <OrderProcess /> } ></Route>
        <Route path='/register' element={ <Register /> } ></Route>
      </Routes>
      </LoadScript>
    </div>
  );
}

export default App;
