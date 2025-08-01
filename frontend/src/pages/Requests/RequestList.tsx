import React, { useEffect, useState } from "react";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
import axios from "axios";

interface Request {
  name: string;
  phone: string;
  package: {
    name: string;
  };
  createdAt: string;
  payed_at: string;
  createdBy?: {
    name: string;
  };
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const getRequests = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/payment/get_requests`, config);
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getRequests();
  }, []);

  return (
    <div className="max-w-full overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-400">Requests</h2>
        <a
          href="/create-request"
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-700 transition"
        >
          Add Request
        </a>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length > 0 ? (
        <RequestDataTable data={requests} />
      ) : (
        <p className="text-gray-600">No requests available</p>
      )}
    </div>
  );
};

export default RequestList;
