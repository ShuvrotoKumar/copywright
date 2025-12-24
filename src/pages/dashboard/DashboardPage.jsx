import { FaChevronDown, FaUsers, FaVideo } from "react-icons/fa";
import { useState } from "react";
import dayjs from "dayjs";
import RecentUsers from "./RecentUsers";
import TotalView from "./TotalView";

function DashboardPage() {
  const currentYear = dayjs().year();
  const startYear = 2020;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-5 p-4 md:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { value: '200K', label: 'Total User' },
          { value: '1200', label: 'Venue Listed' },
          { value: '1200', label: 'Venue Booked' },
          { value: '$120K', label: 'Total Revenue' }
        ].map((stat, index, array) => (
          <div 
            key={stat.label}
            className={`bg-[#F2F2F2] p-4 rounded-lg flex flex-col items-center justify-center min-h-[120px] ${
              index < array.length - 1 ? 'md:border-r-2 md:border-[#111826]' : ''
            }`}
          >
            <p className="text-[#111826] text-2xl md:text-3xl font-bold">{stat.value}</p>
            <p className="text-[#111826] text-lg md:text-xl font-semibold text-center">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* User Growth Section */}
      <div className="w-full bg-[#F2F2F2] rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-xl text-[#111826] font-semibold">User Growth</h1>
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
        <div className="h-64 md:h-80">
          <TotalView />
        </div>
      </div>
      {/* Recent Users Section */}
      <div className="w-full">
        <h1 className="text-xl md:text-2xl text-[#111826] font-bold mb-4">Recent Joined Users</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <RecentUsers />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
