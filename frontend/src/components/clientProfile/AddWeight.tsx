import CircularSlider from "@fseehawer/react-circular-slider";
import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router"
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import axiosInstance from "../../api/axios";

const AddWeight = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [value, setValue] = useState(75);
    const decimalSteps = Array.from({ length: 1601 }, (_, i) => (40 + i * 0.1).toFixed(1));
    const handleSubmit = async () => {
        const response = await axiosInstance.post(`/user/weightInput/${userId}`, { value });
        if (response.status === 201) {
            alert("Weight submitted successfully!");
            navigate(`/client-details/${userId}`)
        } else {
            alert("Failed to submit weight.");
        }
    }
    return (
        <ComponentCard title="Daily Weight Input" className="!p-4 w-full md:w-1/2 lg:w-1/3">
            <Box className="knob flex flex-col items-center">
                <CircularSlider
                    label="kg"
                    labelColor="#005a58"
                    knobColor="#005a58"
                    progressColorFrom="#4F7E6F"
                    progressColorTo="#1D3833"
                    progressSize={20}
                    trackColor="#ACC5BC"
                    labelBottom={true}
                    trackSize={20}
                    data={decimalSteps}
                    dataIndex={Math.round((value - 40) * 10)} // 0.1 precision → multiply by 10
                    onChange={(val: any) => setValue(parseFloat(val))}
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

export default AddWeight