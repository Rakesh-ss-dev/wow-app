import { useEffect, useState } from "react";
import axios from "axios";
import HealthReportsDataTable from "../../components/datatables/HealthReportsDataTable";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const HealthReportsList = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(`${SERVER_URL}/client/getRequests`, config);
        setReports(res.data || []);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (reports.length === 0) return <p>No Reports Available</p>;

  return <HealthReportsDataTable data={reports} />;
};

export default HealthReportsList;
