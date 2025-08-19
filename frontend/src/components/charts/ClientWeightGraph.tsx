import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";

interface ClientWeightGraphProps {
    userId: any;
}

interface WeightEntry {
    date: string;
    weight: number;
}

const WeightChartOptions = (yTitle: string): ApexOptions => {
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

// Reusable series builder
const prepareWeightSeries = (data: WeightEntry[]) => {
    return [
        {
            name: "Weight",
            data: data.map((entry) => ({
                x: new Date(entry.date).toLocaleDateString(),
                y: entry.weight,
            })),
        },
    ];
};

const ClientWeightGraph = ({ userId }: ClientWeightGraphProps) => {
    const [weightGraphData, setWeightGraphData] = useState<WeightEntry[]>([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
    const token = localStorage.getItem("token");
    const getWeightGraphData = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/payment/getWeightGraphData/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Weight Graph Data:", res.data);
            setWeightGraphData(res.data);
        } catch (error) {
            console.error("Error fetching weight graph data:", error);
        }
    };
    useEffect(() => {
        getWeightGraphData();
    }, [userId]);
    return (
        <ComponentCard title="Daily Weight Report" className="w-full md:w-1/2 m-5">
            <div className="w-full">
                <Chart
                    options={WeightChartOptions("Weight (kg)")}
                    series={prepareWeightSeries(weightGraphData)}
                    type="area"
                    height={300}
                />
            </div>
        </ComponentCard>
    )
}

export default ClientWeightGraph