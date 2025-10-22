import React, { useEffect, useState } from "react";
import UserDataTable from "../../components/datatables/UserDataTable";
import axios from "axios";
import Input from "../../components/form/input/InputField";
import { filterRequests } from "../../utils/search";
import ComponentCard from "../../components/common/ComponentCard";

// Sample data

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const token = localStorage.getItem("token");
const UserDataTableRes: React.FC = () => {

  const [users, setUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const getUsers = async () => {
      const res = await axios(`${SERVER_URL}/auth/users`, config);
      setUsers(res.data.users);
    };
    getUsers();
  }, []);
  useEffect(() => {
    setFilteredRequests(filterRequests(users, searchTerm, ["name", "email", "mobile"]));
  }, [searchTerm, users]);

  return (
    <ComponentCard title="Coaches List">
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2">
          <Input className="" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search coach name, email or Mobile Number" />
        </div>
        <a
          href='/create-coach'
          className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
        >
          Add Coach
        </a>
      </div>
      <UserDataTable data={filteredRequests} />
    </ComponentCard>
  );
};

export default UserDataTableRes;
