import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import Payment_requests from "./pages/Payment_requests";
import Users from "./pages/Users";
import Create_Users from "./pages/Create_Users";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/payment-requests' element={<Payment_requests/>}/>
        <Route path="/users" element={<Users/>} />
        <Route path='/user/create' element={<Create_Users/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);
