import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
interface Request {
  name: string;
  phone: string;
  package: {
    name: string;
  };
  amount: string;
  status: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
}

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");
  const retryTimeoutRef = useRef<number | null>(null); // ✅ Fix applied

  const getRequest = async (retryCount = 0) => {
    try {
      const res = await axios.get(`${SERVER_URL}/payment/get_requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedData: Request[] = res.data.requests.sort(
        (a: Request, b: Request) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setRequests(sortedData);
    } catch (error: any) {
      if (error.response?.status === 429 && retryCount < 3) {
        const delay = Math.min(Math.pow(2, retryCount) * 1000, 8000); // Max 8s delay
        console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);

        retryTimeoutRef.current = window.setTimeout(() => getRequest(retryCount + 1), delay); // ✅ Fix applied
      } else {
        console.error("Error fetching requests:", error);
      }
    }
  };

  useEffect(() => {
    if (token) getRequest();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [SERVER_URL, token]);

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-400">Requests</h2>
        <a
          href="/create-request"
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-700"
        >
          Add Request
        </a>
      </div>
      {requests.length > 0 ? (
        <RequestDataTable data={requests} />
      ) : (
        <p className="text-gray-600">No requests available</p>
      )}
    </div>
  );
};

export default RequestList;
