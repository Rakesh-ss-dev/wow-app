import React, { useEffect, useState } from "react";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
import axios from "axios";
import { filterRequests } from "../../utils/search";
import Input from "../../components/form/input/InputField";
import PageMeta from "../../components/common/PageMeta";
import { Component } from "lucide-react";
import ComponentCard from "../../components/common/ComponentCard";

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

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  useEffect(() => {
    setFilteredRequests(filterRequests(requests, searchTerm, ["name", "phone", "city"]));
  }, [searchTerm, requests]);
  return (
    <>
      <PageMeta title="Requests List" description="List of all requests" />
      <ComponentCard title="Requests List" createLink={`/create-request`} createTitle="Add Request">
        <div className="max-w-full overflow-x-auto p-4">

          <div className="w-full mb-4">
            <Input className="w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search User name or Mobile Number" />
          </div>

          {loading ? (
            <p className="text-gray-600">Loading requests...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : requests.length > 0 ? (
            <RequestDataTable data={filteredRequests} />
          ) : (
            <p className="text-gray-600">No requests available</p>
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default RequestList;
