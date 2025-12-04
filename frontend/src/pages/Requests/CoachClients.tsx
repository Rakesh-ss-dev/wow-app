import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { filterRequests } from "../../utils/search";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import RequestDataTable from "../../components/datatables/RequestsDataTable";
import { useParams } from "react-router";

const CoachClients = () => {
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
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { coachId } = useParams();

    const getRequests = async () => {
        try {
            const res = await axiosInstance.get(`/coach/${coachId}/clients`);
            setRequests(res.data.clients || []);
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
}

export default CoachClients