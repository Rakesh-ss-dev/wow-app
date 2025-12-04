import React, { useEffect, useState } from "react";
import UserDataTable from "../../components/datatables/UserDataTable";
import Input from "../../components/form/input/InputField";
import { filterRequests } from "../../utils/search";
import ComponentCard from "../../components/common/ComponentCard";
import axiosInstance from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";

// Sample data
const UserDataTableRes: React.FC = () => {

  const [users, setUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  useEffect(() => {

    const getUsers = async () => {
      const res = await axiosInstance.get(`/auth/users`);
      setUsers(res.data.users);
    };
    getUsers();
  }, []);
  useEffect(() => {
    setFilteredRequests(filterRequests(users, searchTerm, ["name", "email", "mobile"]));
  }, [searchTerm, users]);

  return (
    <>
      <PageMeta title="Coaches List" description="List of all coaches" />
      <ComponentCard title="Coaches List">
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/2">
            <Input className="" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search coach name, email or Mobile Number" />
          </div>
          {parsedUser?.isSubUser ? null : (
            <a
              href='/create-coach'
              className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
            >
              Add Coach
            </a>
          )}
        </div>
        <UserDataTable data={filteredRequests} />
      </ComponentCard>
    </>
  );
};

export default UserDataTableRes;
