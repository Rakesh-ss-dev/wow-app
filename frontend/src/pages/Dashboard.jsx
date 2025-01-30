import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Topbar from "../Components/Topbar";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
    <Topbar/>
    <Sidebar/>
    </>
  );
};

export default Dashboard;
