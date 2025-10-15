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
                fontFamily: 'Outfit, sans-serif',
            },
            stroke: { curve: "smooth" },
            colors: ["#598D7B"],
            xaxis: {
                type: "category",
                labels: { rotate: -45 },
            },
            yaxis: {
                title: { text: yTitle },
                labels: {
                    formatter: (value: number) => value.toFixed(2),
                },
            },
        };
    };
    const prepareSeries = (data: BodyMetric[]) => {
        return [
            {
                name: "Body Metric Index",
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
        } else {
            alert("Error in submitting data")
        }
    };
    return (

        <div className="flex flex-col gap-4">
            <div className="flex justify-between flex-column md:flex-row gap-4">
                <div className="w-1/3">
                    <ComponentCard title="Body Metric Index">
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
                                    <p className="mt-3 text-center">{bmi ? (bmi < 18.5 ? <span className="text-red-600">Underweight</span> : bmi < 24.9 ? <span className="text-green-500">Normal weight</span> : bmi < 29.9 ? <span className="text-orange-500">Overweight</span> : <span className="text-red-700">Obesity</span>) : ""}</p>
                                </div>
                                <Button >Submit</Button>
                            </div>
                        </form>
                    </ComponentCard>
                </div>
                <div className="w-2/3">
                    <ComponentCard title="Body Metric Index">
                        <Chart
                            className="apex-charts w-full"
                            options={chartOptions("Weight (kg)")}
                            series={prepareSeries(value)}
                            type="area"

                            height={300}
                        />
                    </ComponentCard>
                </div>
            </div>
        </div>
    )
}

export default BodyMetricIndex