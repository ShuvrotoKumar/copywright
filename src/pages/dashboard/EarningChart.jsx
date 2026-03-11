import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGetEarningQuery } from '../../redux/api/earningApi';
import dayjs from 'dayjs';
import { FaChevronDown } from 'react-icons/fa';

const EarningChart = () => {
  const currentYear = dayjs().year();
  const startYear = 2020;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useGetEarningQuery({
    year: selectedYear,
    page: 1
  });

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  const chartData = data?.data?.monthlyBreakdown?.map((item) => ({
    name: item.monthName.substring(0, 3), // e.g., "Jan"
    netAmount: item.netAmount,
    grossAmount: item.grossAmount,
  })) || [];

  return (
    <div className="w-full bg-[#F2F2F2] rounded-lg shadow-md p-4 md:p-6 mb-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-2">
        <h1 className="text-xl text-[#111826] font-semibold">Earnings Overview</h1>
        <div className="relative w-full md:w-40">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-2 border border-[#111827] rounded-md flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-[#111827] text-sm md:text-base">{selectedYear}</span>
            <FaChevronDown className={`text-[#111827] w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {years.map((year) => (
                  <div
                    key={year}
                    onClick={() => handleSelect(year)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors text-sm md:text-base ${
                      year === selectedYear ? "bg-blue-50 text-[#111826] font-medium" : "text-gray-700"
                    }`}
                  >
                    {year}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="h-48 md:h-60 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-[#111826]">
            Loading...
          </div>
        ) : isError ? (
          <div className="h-full flex items-center justify-center text-red-600">
            Failed to load earnings data.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart
              data={chartData}
              margin={{
                top: -10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111826" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#111826" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-[#111826]" />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} className="text-[#111826]" />
              <Tooltip
                formatter={(value) => [`€${value}`, '']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                verticalAlign="top" 
                align="center"
                iconType="circle" 
                wrapperStyle={{ top: -50, width: '100%', display: 'flex', justifyContent: 'center' }} 
              />
              <Area
                type="monotone"
                dataKey="netAmount"
                name="Net Amount"
                stroke="#111826"
                fillOpacity={1}
                fill="url(#colorNet)"
              />
              <Area
                type="monotone"
                dataKey="grossAmount"
                name="Gross Amount"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorGross)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default EarningChart;
