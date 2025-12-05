import React, { useEffect, useState } from "react";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
import { filterRequests } from "../../utils/search";
import Input from "../../components/form/input/InputField";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import axiosInstance from "../../api/axios";

interface Request {
  name: string;
  phone: string;
  package: {
    name: string;
  };
  city: string;
  _id: string;
  createdAt: string;
  payed_at: string;
  createdBy?: {
    name: string;
  };
}


const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const user: any = JSON.parse(localStorage.getItem("user") || "{}");
  const [searchTerm, setSearchTerm] = useState("");

  const getRequests = async () => {
    try {
      const res = await axiosInstance.get(`/payment/get_requests`);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Failed to load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRequests();
  }, []);
  useEffect(() => {
    setFilteredRequests(filterRequests(requests, searchTerm, ["name", "phone", "city"]));
  }, [searchTerm, requests]);
  return (
    <>
      <PageMeta title="Requests List" description="List of all requests" />
      <ComponentCard title="Requests List" {...(user.role == "Nutritionist" ? {} : { createLink: `/create-request`, createTitle: "Add Request" })} >
        <div className="max-w-full overflow-x-auto p-4">

          <div className="w-full mb-4">
            <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
          </div>

          {loading ? (
            <p className="text-gray-600">Loading Clients...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : requests.length > 0 ? (
            <RequestDataTable data={filteredRequests} />
          ) : (
            <p className="text-gray-600">No clients available</p>
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default RequestList;
