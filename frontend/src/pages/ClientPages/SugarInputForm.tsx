import { useState } from "react";
import CircularSlider from "@fseehawer/react-circular-slider";
import { Box } from "@mui/material";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const SugarInputForm = () => {
  const [fastingValue, setFastingValue] = useState(120);
  const [value, setValue] = useState(120);
  const token = localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
  const handleFastSubmit=async ()=>{
        try {
            const response = await axios.post(`${SERVER_URL}/client/fastingSugar/submit`, {
                fastingValue: fastingValue,
            }, config); 
            if (response.status === 201) {
                alert("Fasting Sugar submitted successfully!");
            } else {
                alert("Failed to submit weight.");
            }
        } catch (error) {
            console.error("Error submitting weight:", error);
        }
    }
  const handleRandomSubmit= async()=>{
      try {
            const response = await axios.post(`${SERVER_URL}/client/randomSugar/submit`, {
                randomValue: value,
            }, config); 
            if (response.status === 201) {
                alert("Random Sugar submitted successfully!");
            } else {
                alert("Failed to submit weight.");
            }
        } catch (error) {
            console.error("Error submitting weight:", error);
        }
  }
  return (
    <div className="flex flex-col md:flex-row items-center justify-around h-full">
      <ComponentCard title="Fasting Blood Sugar Level" className="!p-4 w-full md:w-1/2 lg:w-1/3">
        <Box className="flex flex-col items-center">
          <CircularSlider
            label="mg/dL"
            labelColor="#005a58"
            knobColor="#005a58"
            progressColorFrom="#4F7E6F"
            progressColorTo="#1D3833"
            progressSize={20}
            trackColor="#ACC5BC"
            trackSize={20}
            min={40}
            max={450}
            dataIndex={fastingValue - 40}
            onChange={(val: any) => setFastingValue(val)}
            knobSize={35}
            knobPosition="bottom"
          />
          <Button size="sm" className="mt-4" onClick={handleFastSubmit}>
            Submit
          </Button>
        </Box>
      </ComponentCard>
      <ComponentCard title="Regular Blood Sugar Level" className="!p-4 w-full md:w-1/2 lg:w-1/3">
        <Box className="flex flex-col items-center">
          <CircularSlider
            label="mg/dL"
            labelColor="#005a58"
            knobColor="#005a58"
            progressColorFrom="#4F7E6F"
            progressColorTo="#1D3833"
            progressSize={20}
            trackColor="#ACC5BC"
            trackSize={20}
            min={40}
            max={450}
            dataIndex={value - 40}
            onChange={(val: any) => setValue(val)}
            knobSize={35}
            knobPosition="bottom"
          />
          <Button size="sm" className="mt-4" onClick={handleRandomSubmit}>
            Submit
          </Button>
        </Box>
      </ComponentCard>
    </div>
  );
};

export default SugarInputForm;
