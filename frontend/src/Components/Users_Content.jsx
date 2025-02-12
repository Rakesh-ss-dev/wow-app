import axios from "axios";
import { Button, Table } from "flowbite-react";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Users_Content = () => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);
  const getUsers = async () => {
    const res = await axios(`${SERVER_URL}/auth/users`, config);
    setUsers(res.data.users);
  };
  return (
    <div className="items-center bg-slate-300 p-4 sm:ml-64">
        <Link to={'/user/create'}><Button><Plus/> Create User</Button></Link>
      {users.length > 0 ? (
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Mobile</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.mobile}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <h1>No Users</h1>
      )}
    </div>
  );
};

export default Users_Content;
