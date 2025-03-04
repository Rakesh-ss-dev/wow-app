import axios from "axios";
import React, { useEffect, useState } from "react";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
interface Request {
  name: string;
  phone: string;
  package: {
    name: string;
  };
  amount:string;
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

  // Fetch requests data
 
  useEffect(() => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    const getRequest = async () => {
        try {
          const res = await axios.get(`${SERVER_URL}/payment/get_requests`, config);
          setRequests(res.data.requests);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
    getRequest();
  }, [SERVER_URL,token]);

  return (
      <div className="max-w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-400">Requests</h2>
        <a
          href='/create-request'
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-700"
        >
          Add Request
        </a>
      </div>
          {requests.length > 0 ? (
            <RequestDataTable data={requests}/>
          ) : (
            <p className="text-gray-600">No requests available</p>
          )}
        </div>
  );
};

export default RequestList;
