import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Users_Content from '../Components/Users_Content';
import Topbar from '../Components/Topbar';
import ToggleButton from '../Components/ToggleButton';
import Sidebar from '../Components/Sidebar';

const Users = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(()=>{
        if(!token){
            navigate('/')
        }
    },[token])
  return (
    <>
      <Topbar />
      <div className="relative top-36">
        <ToggleButton />
        <Sidebar />
        <Users_Content/>
      </div>
    </>
  )
}

export default Users