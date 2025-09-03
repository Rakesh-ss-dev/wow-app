import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import SelfRegisteredTable from "../components/datatables/SelfRegisteredTable";

type Request = {
    name: string;
    phone: string;
    createdBy?: {
        name: string;
    };
};

const SelfRegistered = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get("/payment/getSelfRegistered");
            setRequests(response.data.requests);
        } catch (error) {
            console.error("Error fetching self-registered requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []); // fetch once on mount

    return (
        <div className="p-6">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <SelfRegisteredTable data={requests} />
            )}
        </div>
    );
};

export default SelfRegistered;
