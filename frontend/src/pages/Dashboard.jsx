import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Topbar from "../Components/Topbar";
import Sidebar from "../Components/Sidebar";
import Content from "../Components/Content";
import ToggleButton from "../Components/ToggleButton";

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
      <Topbar />
      <div className="relative top-32">
        <ToggleButton />
        <Sidebar />
        <Content />
      </div>
    </>
  );
};

export default Dashboard;
