import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
const token = localStorage.getItem("token");
export default function Blank() {
  const getLastMonthToTodayDates = () => {
    let dates = [];
    let today = new Date();
    let lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1); // Set to last month
    while (lastMonth <= today) {
      dates.push(lastMonth.toISOString()); // Convert to ISO format
      lastMonth.setDate(lastMonth.getDate() + 1); // Increment by one day
    }
    return dates;
  };

  const [chartData,setCharData] = useState({
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100, 120, 90, 80], // Update as per length
      },
      {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41, 60, 50, 70], // Update as per length
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area" as const,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth" as const,
      },
      xaxis: {
        type: "datetime" as const,
        categories: getLastMonthToTodayDates(), // Dynamically set categories
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });
  useEffect(() => {
    const getChartData = async () => {
      const response = await axios.get(`${SERVER_URL}/payment/chart-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCharData({...chartData,series:response.data.series})
    };
    getChartData();
  }, []);
  return (
    <div>
      <PageMeta title="WOW dashboard" description="Wow Dashboard" />
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <div>
            <div id="chart">
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={350}
              />
            </div>
            <div id="html-dist"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
