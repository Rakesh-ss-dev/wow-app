import React, { useEffect, useState } from "react";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
import { io, Socket } from "socket.io-client";
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
  const user = localStorage.getItem("user");
  const serverUrl=import.meta.env.VITE_SERVER_URL.replace('/api','');
  useEffect(() => {
    const socket: Socket = io(serverUrl); // Create socket instance

    if (user) {
      socket.emit("get_requests", user);
    }

    socket.on("requests_data", (data) => {
      setRequests(data);
    });

    socket.on("error", (error) => {
      console.error("WebSocket Error:", error.message);
    });

    // ✅ Cleanup function to disconnect socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [user]); // Depend on userId to re-connect if needed

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
