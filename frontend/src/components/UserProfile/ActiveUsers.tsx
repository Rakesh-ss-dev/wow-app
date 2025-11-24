import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
const ActiveUsers = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const handleClick = async (e: any, id: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/payment/deactivate_user`,
        { id }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Error making User active:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axiosInstance.get(`/payment/get_active_users`);

        if (res.data?.requests) {
          const sortedRequests = [...res.data.requests].sort(
            (a, b) => new Date(b.activated_at).getTime() - new Date(a.activated_at).getTime()
          );
          setRequests(sortedRequests);
        } else {
          console.warn("Unexpected response format:", res.data);
          setRequests([]);
        }
      } catch (err) {
        console.error("Error fetching paid users:", err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [loading, requests]);

  if (loading)
    return (
      <div className="p-5">
        <p>Requests Loading</p>
      </div>
    );

  if (requests.length === 0)
    return (
      <div className="p-5">
        <p>No Active Users</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 mt-7 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {requests.map((request: any) => (
        <a href={`/client-details/${request._id}`}>
          <UserCard
            key={request._id}
            title={request.name}
            date={request.activated_at}
            plan={request.package.name}
            placeButton={true}
            buttonText="Deactivate User"
            clickFunction={(e: any) => handleClick(e, request._id)}
          />
        </a>
      ))}
    </div>
  );
};

export default ActiveUsers;
