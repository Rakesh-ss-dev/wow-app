import { useState, useEffect } from "react";
import axios from "axios";
import Select from "../components/form/Select";
import Label from "../components/form/Label";
import Form from "../components/form/Form";
import Button from "../components/ui/button/Button";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
interface Option {
  label: string;
  value: string;
}

const MyComponent = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const changeUser = (value: any) => {
    setSelectedUser(value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/api/payment/user-status/${selectedUser}`,
        {
          responseType: "blob",
        }
      );
      if (response.data.type === "application/json") {
        const text = await response.data.text();
        const jsonData = JSON.parse(text);
        alert(jsonData.message);
        return;
      }
      // If response is a file, download it
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "payments.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the report. Please try again.");
    }
  };
  useEffect(() => {
    const getUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${SERVER_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedOptions: Option[] = res.data.users.map((user: any) => ({
          label: user.name,
          value: user._id,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Label>User</Label>
          <Select options={options} onChange={changeUser} required={true} />
        </div>

        <Button type="submit">Generate Report</Button>
      </Form>
      {selectedUser && <p>Selected User ID: {selectedUser}</p>}
    </div>
  );
};

export default MyComponent;
