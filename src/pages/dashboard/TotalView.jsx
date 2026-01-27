/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const demoData = [
  { month: "Jan", videoView: 50 },
  { month: "Feb", videoView: 70 },
  { month: "Mar", videoView: 60 },
  { month: "Apr", videoView: 80 },
  { month: "May", videoView: 90 },
  { month: "Jun", videoView: 75 },
  { month: "Jul", videoView: 85 },
  { month: "Aug", videoView: 95 },
  { month: "Sep", videoView: 70 },
  { month: "Oct", videoView: 80 },
  { month: "Nov", videoView: 100 },
  { month: "Dec", videoView: 110 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { month } = payload[0].payload;
    const { name, value } = payload[0];
    return (
      <div className="bg-white shadow-md p-3 rounded-md border text-gray-700 text-[#111826]">
        <p className="font-medium text-[#111826]">Month: {month}</p>
        <p className="font-medium text-[#111826]">{name}: {value}</p>
      </div>
    );
  }
  return null;
};

const TotalView = ({ data = demoData, dataKey = "videoView" }) => {
  const [chartHeight, setChartHeight] = useState(220);

  const safeData = Array.isArray(data) && data.length ? data : demoData;
  const maxValue = Math.max(
    ...safeData.map((item) => Number(item?.[dataKey] ?? 0)),
    0
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 220) {
        setChartHeight(250); // Adjust height for mobile
      } else if (window.innerWidth < 768) {
        setChartHeight(220); // Adjust height for smaller tablets
      } else {
        setChartHeight(220); // Default height for larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount to set the initial height

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={safeData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis tickLine={false} dataKey="month" className="text-[#111826]" />
          <YAxis
            tickLine={false}
            domain={[0, maxValue + 10]}
            className="text-[#111826]"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            barSize={30}
            radius={[5, 5, 0, 0]}
            dataKey={dataKey}
            fill="#111826"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalView;
