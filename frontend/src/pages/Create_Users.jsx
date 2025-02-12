import React, { useEffect } from 'react'
import User_Form from '../Components/User_Form'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import ToggleButton from '../Components/ToggleButton';
import Topbar from '../Components/Topbar';

const Create_Users = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(()=>{if(!token){
        navigate('/');
    }},[])
  return (
    <>
      <Topbar />
      <div className="relative top-36">
        <ToggleButton />
        <Sidebar />
        <User_Form/>
      </div>
    </>
    
  )
}

export default Create_Users