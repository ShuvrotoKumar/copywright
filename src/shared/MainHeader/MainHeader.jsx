/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { useGetAllNotificationQuery } from "../../redux/api/notificationApi";

const MainHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  // Mock data to prevent API errors
  const data = { notifications: [] };
  const refetch = () => Promise.resolve();

  const notifications = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.notifications)
        ? data.data.notifications
        : Array.isArray(data?.notifications)
          ? data.notifications
          : [];

  const badgeCount = notifications.length;

  return (
    <div className="relative w-full px-5">
      <header className="shadow-sm rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="flex justify-between items-center px-5 md:px-10 h-[80px]">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded hover:opacity-80 focus:outline-none"
          >
            <IoMenu className="w-8 h-8 text-[#111826]" />
          </button>
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={async () => {
                try {
                  await refetch();
                } finally {
                  navigate("/notifications");
                }
              }}
              className="relative p-2 rounded-full border border-[#111826] hover:bg-white/60 transition"
            >
              <IoNotificationsOutline className="w-6 h-6 text-[#111826]" />
              {badgeCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111826] text-white text-[10px] px-1 leading-none">
                  {badgeCount}
                </span>
              ) : null}
            </button>
            {/* Chat */}

            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 cursor-default"
            >
              <img
                src="https://avatar.iran.liara.run/public/31"
                className="w-8 md:w-12 h-8 md:h-12 object-cover rounded-full"
                alt="User Avatar"
              />
              <div>
                <h3 className="hidden md:block text-[#111826] text-lg font-semibold">
                  Mr. Admin
                </h3>
                <p className="text-[#111826] text-lg font-semibold">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default MainHeader;
