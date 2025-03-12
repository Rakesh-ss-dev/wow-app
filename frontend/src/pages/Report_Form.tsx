import { useState } from "react";
import axios from "axios";
import Label from "../components/form/Label";
import Form from "../components/form/Form";
import Button from "../components/ui/button/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const MyComponent = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVER_URL}/payment/user-status/`,
        { startDate, endDate },
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
      alert("No Entries present between the dates.");
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Label>Start Date</Label>
          <DatePicker
            selected={startDate}
            onChange={(date: any) => setStartDate(date)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="mb-3">
          <Label>End Date</Label>
          <DatePicker
            selected={endDate}
            onChange={(date: any) => setEndDate(date)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <Button type="submit">Generate Report</Button>
      </Form>
    </div>
  );
};

export default MyComponent;
