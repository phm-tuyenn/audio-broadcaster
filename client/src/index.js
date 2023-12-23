import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import "./assets/style.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout';
import Home from "./pages/Home"
import Schedule from './pages/Schedule'
import Device from './pages/Device';
import Error404 from "./Error404"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}></Route>
        <Route path="/schedule" element={<Schedule/>}></Route>
        <Route path="/device" element={<Device/>}></Route>
        <Route path="*" element={<Error404/>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
