import axios from "axios";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";

const OldUsers = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios(`${SERVER_URL}/payment/get_old_users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests);
      } catch (err) {
        console.error("Error fetching paid users:", err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  if (loading)
    return (
      <div className="p-5">
        <p>Requests Loading</p>
      </div>
    );

  if (requests.length === 0)
    return (
      <div className="p-5">
        <p>No Old Users</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 mt-7 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {requests.map((request: any) => (
        <UserCard
          key={request._id}
          title={request.name}
          date={new Date(request.payed_at).toLocaleDateString()}
          plan={request.package.name}
        />
      ))}
    </div>
  );
};

export default OldUsers;
