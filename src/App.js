import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

import './App.css';
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import Home from "./Home";
import UtownSlots from "./GymSlots/UtownSlots";
import UscSlots from "./GymSlots/UscSlots";
import KrmpshSlots from "./GymSlots/KrmpshSlots";
import OutreachSlots from "./GymSlots/OutreachSlots";
import 'bootstrap/dist/css/bootstrap.min.css';
import Statistics from './Statistics';
import UpcomingBooking from './UpcomingBooking';
import Activities from './Activities';
import Telegram from './Telegram';


function App() {
  return (
  <div className="app">
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />
      <Route path ="/home" element={<Home />} />
      <Route path ="/utownSlots" element={<UtownSlots />} />
      <Route path ="/uscSlots" element={<UscSlots />} />
      <Route path ="/krmpshSlots" element={<KrmpshSlots />} />
      <Route path ="/outreachSlots" element={<OutreachSlots />} />
      <Route path ="/outreachSlots" element={<OutreachSlots />} />
      <Route path ="/statistics" element={<Statistics />} />
      <Route path ="/upcomingbooking" element={<UpcomingBooking />} />
      <Route path ="/activities" element={<Activities />} />
      <Route path ="/telegram" element={<Telegram />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;