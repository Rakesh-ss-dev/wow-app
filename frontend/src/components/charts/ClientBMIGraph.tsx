import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { ApexOptions } from "apexcharts";
import ComponentCard from "../common/ComponentCard";
import Chart from "react-apexcharts";
interface BodyMetric {
    bmi: number;
    date: string;
}
interface ClientBMIGraphProps {
    userId: any;
}
const ClientBMIGraph = ({ userId }: ClientBMIGraphProps) => {
    const [bmiValues, setBmiValues] = useState<BodyMetric[]>([])
    const fetchBmiData = async () => {
        try {
            const res = await axiosInstance.get(`/payment/getBMIGraphData/${userId}`);
            setBmiValues(res.data);
        } catch (error) {
            console.error("Error fetching BMI data:", error);
        }
    };
    useEffect(() => {
        fetchBmiData();
    }, [userId]);

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
    return (
        <ComponentCard title="Daily BMI Report" className="w-full md:w-1/2 m-5">
            <div className="w-full">
                <Chart
                    options={chartOptions("BMI (kg/m²)")}
                    series={prepareSeries(bmiValues)}
                    type="area"
                    height={300}
                />
            </div>
        </ComponentCard>
    )
}

export default ClientBMIGraph