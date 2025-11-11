
import ComponentCard from "../common/ComponentCard"
import CircularSlider from "@fseehawer/react-circular-slider"
import Button from "../ui/button/Button"
import { useState } from "react"
import { Box } from "@mui/material"
import { Link, useParams } from "react-router"
import { ArrowBigLeftDash } from "lucide-react"
import axiosInstance from "../../api/axios"

const AddSugar = () => {
    const { userId } = useParams();
    const [fastingValue, setFastingValue] = useState(120);
    const [value, setValue] = useState(120);
    const handleFastSubmit = async () => {
        const response = await axiosInstance.post(`/user/fasting-sugar/${userId}`, { fastingValue });
        if (response.status === 201) {
            alert(response.data.message);
        } else {
            alert("Failed to Sugar Input.");
        }
    }
    const handleRandomSubmit = async () => {
        const response = await axiosInstance.post(`/user/random-sugar/${userId}`, { randomValue: value });
        if (response.status === 201) {
            alert(response.data.message);
        } else {
            alert("Failed to Sugar Input.");
        }
    }
    return (
        <div>
            <Link className="mb-3 text-brand-500 flex gap-3" to={`/client-details/${userId}`}><ArrowBigLeftDash /> Back to stats</Link>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-2/3">
                <ComponentCard title="Fasting Blood Sugar Level" className="!p-4 w-full md:w-1/2 lg:w-1/2">
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
                            labelBottom={true}
                        />
                        <Button size="sm" className="mt-4" onClick={handleFastSubmit}>
                            Submit
                        </Button>
                    </Box>
                </ComponentCard>
                <ComponentCard title="Regular Blood Sugar Level" className="!p-4 w-full md:w-1/2 lg:w-1/2">
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
                            labelBottom={true}
                        />
                        <Button size="sm" className="mt-4" onClick={handleRandomSubmit}>
                            Submit
                        </Button>
                    </Box>
                </ComponentCard>
            </div>
        </div>
    )
}

export default AddSugar