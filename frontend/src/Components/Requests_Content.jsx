import axios from "axios";
import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Requests_Content = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [statuses, setStatuses] = useState({});
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Send token in headers
    },
  };

  const formatReadableDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fetch requests data
  const getRequest = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/payment/get_requests`, config);
      setRequests(res.data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  // Fetch payment statuses
  const fetchStatuses = async () => {
    if (requests.length === 0) return;

    try {
      const statusPromises = requests.map(async (req) => {
        if (req.paymentId) {
          try {
            const response = await axios.get(
              `${SERVER_URL}/payment/payment-status/${req.paymentId}`,
              config,
            );
            return { [req.paymentId]: response.data.status };
          } catch (error) {
            console.error(`Error fetching status for ${req.paymentId}:`, error);
            return { [req.paymentId]: "Error" };
          }
        }
        return { [req.paymentId]: "N/A" };
      });

      const results = await Promise.all(statusPromises);
      const statusUpdates = Object.assign({}, ...results);
      setStatuses(statusUpdates);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    getRequest();
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [requests]);

  return (
    <div className="flex h-full items-center justify-center bg-slate-300 p-4 sm:ml-64">
      {requests.length > 0 ? (
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Package</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Created At</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {requests.map((req) => (
                <Table.Row
                  key={req.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{req.name}</Table.Cell>
                  <Table.Cell>{req.phone}</Table.Cell>
                  <Table.Cell>{req.package.name}</Table.Cell>
                  <Table.Cell>
                    {req.package.amount} ({req.package.currency})
                  </Table.Cell>
                  <Table.Cell>
                    {statuses[req.paymentId] || "Loading..."}
                  </Table.Cell>
                  <Table.Cell>{formatReadableDate(req.createdAt)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <p className="text-gray-600">No requests available</p>
      )}
    </div>
  );
};

export default Requests_Content;
