import { useState } from "react";
import axios from "axios";
import Label from "../components/form/Label";
import Form from "../components/form/Form";
import Button from "../components/ui/button/Button";
import ComponentCard from "../components/common/ComponentCard";
import Input from "../components/form/input/InputField";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

const MyComponent = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const toLocalDateString = (date: Date | undefined): string | null => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Month is 0-indexed
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVER_URL}/payment/user-status/`,
        { startDate, endDate },
        { responseType: "blob" }
      );

      if (response.data.type === "application/json") {
        const text = await response.data.text();
        const jsonData = JSON.parse(text);
        alert(jsonData.message);
        return;
      }

      // Download file
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
    <ComponentCard className="w-3/4 mx-auto md:w-1/2" title="Generate Report">
      <div className="space-y-6">
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate || ""}
              onDateChange={(dates) =>
                setStartDate(toLocalDateString(dates[0]) || null)
              }
            />
          </div>
          <div className="mb-3">
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate || ""}
              onDateChange={(dates) =>
                setEndDate(toLocalDateString(dates[0]) || null)
              }
            />
          </div>
          <Button type="submit">Generate Report</Button>
        </Form>
      </div>
    </ComponentCard>
  );
};

export default MyComponent;
