import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import { Box } from "@mui/material";
import CircularSlider from "@fseehawer/react-circular-slider";
import Button from "../../components/ui/button/Button";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const WeightInputForm = () => {
    const [value, setValue] = useState(75);
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/client/weight/submit`, {
                weight: value,
            }, config); 
            if (response.status === 201) {
                alert("Weight submitted successfully!");
            } else {
                alert("Failed to submit weight.");
            }
        } catch (error) {
            console.error("Error submitting weight:", error);
        }
    }
        return (
            <ComponentCard title="Daily Weight Input" className="!p-4 w-full md:w-1/2 lg:w-1/3">
                <Box className="flex flex-col items-center">
                    <CircularSlider
                        label="kg"
                        labelColor="#005a58"
                        knobColor="#005a58"
                        progressColorFrom="#4F7E6F"
                        progressColorTo="#1D3833"
                        progressSize={20}
                        trackColor="#ACC5BC"
                        trackSize={20}
                        min={40}
                        max={200}
                        dataIndex={value - 40}
                        onChange={(val: any) => setValue(val)}
                        knobSize={35}
                        knobPosition="bottom"
                    />
                    <Button size="sm" className="mt-4" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </ComponentCard>
        )
    }

    export default WeightInputForm