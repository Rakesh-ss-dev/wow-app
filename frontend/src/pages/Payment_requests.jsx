import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Topbar from "../Components/Topbar";
import Sidebar from "../Components/Sidebar";
import ToggleButton from "../Components/ToggleButton";
import Requests_Content from "../Components/Requests_Content";

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
      <div className="relative top-36">
        <ToggleButton />
        <Sidebar />
        <Requests_Content/>
      </div>
    </>
  );
};

export default Dashboard;
