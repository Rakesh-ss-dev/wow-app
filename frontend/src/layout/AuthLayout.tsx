import  { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function AuthLayout() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(()=>{
    if(token){
      navigate('/dashboard')
    }
  },[token,navigate])
  return (
    <>
      <Outlet />
    </>
  );
}
