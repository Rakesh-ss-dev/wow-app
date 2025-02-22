import React, { useEffect, useState } from "react";
import UserDataTable from "../../components/datatables/UserDataTable";
import axios from "axios";

// Sample data

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const token = localStorage.getItem("token");
const UserDataTableRes: React.FC = () => {
  
  const [users, setUsers] = useState([]);
 
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
  
  return (
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-400">Coaches</h2>
        <a
          href='/create-coach'
          className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
        >
          Add Coach
        </a>
      </div>
        <UserDataTable data={users} />
      </div>
  );
};

export default UserDataTableRes;
