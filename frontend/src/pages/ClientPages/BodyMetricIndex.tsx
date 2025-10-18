import { useEffect, useState } from "react"
import ComponentCard from "../../components/common/ComponentCard"
import Input from "../../components/form/input/InputField"
import Label from "../../components/form/Label"
import Button from "../../components/ui/button/Button"
import axiosInstance from "../../api/axios"
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts"
interface BodyMetric {
    bmi: number;
    date: string;
}
const BodyMetricIndex = () => {
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [bmi, setBmi] = useState<number | "">("");
    const [value, setValues] = useState<BodyMetric[]>([]);
    const chartOptions = (yTitle: string): ApexOptions => {
        return {
            chart: {
                type: "area",
                height: 300,
                toolbar: { show: false },
                zoom: { enabled: false },
                fontFamily: "Outfit, sans-serif",
            },

            stroke: { curve: "smooth" },
            colors: ["#598D7B"],

            grid: {
                borderColor: "#e0e0e0",
                strokeDashArray: 4,
            },

            xaxis: {
                type: "category",
                labels: { rotate: -45 },
            },

            yaxis: {
                title: { text: yTitle },
                labels: {
                    formatter: (value: number) => value.toFixed(2),
                },
                min: 0,
                max: 40, // ensures all BMI zones are visible
            },

            annotations: {
                yaxis: [
                    {
                        y: 0,
                        y2: 18.5,
                        borderColor: "transparent",
                        fillColor: "#42A5F5",
                        opacity: 0.15,
                        label: {
                            text: "Underweight",
                            position: "right",
                            offsetX: 0,
                            style: {
                                color: "#42A5F5",
                                background: "transparent",
                                fontWeight: 600,
                            },
                        },
                    },
                    {
                        y: 18.5,
                        y2: 24.9,
                        borderColor: "transparent",
                        fillColor: "#66BB6A",
                        opacity: 0.15,
                        label: {
                            text: "Normal Weight",
                            position: "right",
                            offsetX: 0,
                            style: {
                                color: "#388E3C",
                                background: "transparent",
                                fontWeight: 600,
                            },
                        },
                    },
                    {
                        y: 25,
                        y2: 29.9,
                        borderColor: "transparent",
                        fillColor: "#FFA726",
                        opacity: 0.15,
                        label: {
                            text: "Overweight",
                            position: "right",
                            offsetX: 0,
                            style: {
                                color: "#FFA726",
                                background: "transparent",
                                fontWeight: 600,
                            },
                        },
                    },
                    {
                        y: 30,
                        y2: 40,
                        borderColor: "transparent",
                        fillColor: "#EF5350",
                        opacity: 0.15,
                        label: {
                            text: "Obesity",
                            position: "right",
                            offsetX: 0,
                            style: {
                                color: "#C62828",
                                background: "transparent",
                                fontWeight: 600,
                            },
                        },
                    },
                ],
            },
        };
    };
    const prepareSeries = (data: BodyMetric[]) => {
        return [
            {
                name: "Body Mass Index",
                data: data.map((entry) => ({
                    x: new Date(entry.date).toLocaleDateString(),
                    y: entry.bmi,
                })),
            },
        ];
    };
    const getValues = async () => {
        const res = await axiosInstance.get('/client/body-metrics');
        if (res.data) {
            setValues(res.data);
        } else {
            alert("Error in fetching data")
        }
    }
    useEffect(() => { getValues() }, [])
    useEffect(() => { setBmi(calculateBMI(Number(height), Number(weight)).toFixed(2) as unknown as number) }, [height, weight])
    const calculateBMI = (height: number, weight: number) => {
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            return weight / (heightInMeters * heightInMeters);
        }
        return 0;
    };
    const submitHandler = async (e: any) => {
        e.preventDefault();
        const res = await axiosInstance.post('/client/body-metrics', { height, weight, bmi });
        if (res.data.success) {
            alert(res.data.message)
            getValues();
        } else {
            alert("Error in submitting data")
        }
    };
    return (

        <div className="flex flex-col gap-4">
            <div className="flex justify-between flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                    <ComponentCard title="Body Mass Index">
                        <form onSubmit={submitHandler} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label className="font-medium">Height (cm)</Label>
                                    <Input type="number" value={height} onChange={(e: any) => setHeight(e.target.value)} />
                                </div>
                                <div>
                                    <Label className="font-medium">Weight (kg)</Label>
                                    <Input type="number" value={weight} onChange={(e: any) => setWeight(e.target.value)} />
                                </div>
                                <div>
                                    <Label className="font-medium">BMI</Label>
                                    <Input type="number" value={bmi} readOnly />
                                    <p className="text-sm text-gray-500 mt-3">Your Body Mass Index (BMI) is a measure of body fat based on your height and weight.</p>
                                    <p className="mt-3 text-center">{bmi ? (bmi < 18.5 ? <span className="text-[#42A5F5]">Underweight</span> : bmi < 24.9 ? <span className="text-[#66BB6A]">Normal weight</span> : bmi < 29.9 ? <span className="text-[#FFA726]">Overweight</span> : <span className="text-[#EF5350]">Obesity</span>) : ""}</p>
                                </div>
                                <Button >Submit</Button>
                            </div>
                        </form>
                    </ComponentCard>
                </div>
                <div className="w-full md:w-2/3">
                    <ComponentCard title="Body Mass Index">
                        <Chart
                            className="apex-charts w-full"
                            options={chartOptions("Weight (kg)")}
                            series={prepareSeries(value)}
                            type="area"
                            height={300}
                        />
                        <div className="flex gap-2 mt-4 text-sm justify-between items-center">
                            <p className="text-[#42A5F5]">Less than 18.5: Underweight</p>
                            <p className="text-[#66BB6A]">18.5 - 24.9: Normal weight</p>
                            <p className="text-[#FFA726]">25 - 29.9: Overweight</p>
                            <p className="text-[#EF5350]">30 or greater: Obesity</p>
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </div>
    )
}

export default BodyMetricIndex