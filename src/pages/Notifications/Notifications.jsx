import { useEffect, useState } from "react";
import { ConfigProvider, List, Button } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  useGetAllNotificationQuery,
  useMarkAllNotificationAsReadMutation,
} from "../../redux/api/notificationApi";

export default function Notifications() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } =
    useGetAllNotificationQuery();
  const [markAllNotificationAsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationAsReadMutation();

  const notifications = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.notifications)
        ? data.data.notifications
        : Array.isArray(data?.notifications)
          ? data.notifications
          : [];

  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems((prev) => {
      const prevReadById = new Map(prev.map((i) => [i.id, i.read]));

      return notifications.map((n, idx) => {
        const id = n?._id || n?.id || idx;

        return {
          id,
          title: n?.title || n?.subject || n?.message || "Notification",
          time: n?.time || n?.createdAt || n?.date || "",
          read: prevReadById.has(id) ? prevReadById.get(id) : !!n?.read,
          description: n?.description || n?.body || n?.message || "",
        };
      });
    });
  }, [notifications]);

  const markRead = (id, read = true) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read } : i)));
  };
  const markAllRead = async () => {
    try {
      await markAllNotificationAsRead().unwrap();
      setItems((prev) => prev.map((i) => ({ ...i, read: true })));
      refetch();
    } catch (e) {
      const message =
        e?.data?.message ||
        e?.error ||
        "Failed to mark all notifications as read.";
      setItems((prev) => prev);
      // reuse the same error area
      // eslint-disable-next-line no-console
      console.error(message);
    }
  };

  const errorMessage =
    error?.data?.message || error?.error || "Failed to load notifications.";

  return (
    <div className="p-5 min-h-screen">
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">
          Notifications
        </h1>
        <div className="ml-0 md:ml-auto w-full md:w-auto flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0">
          <Button onClick={markAllRead} size="small" disabled={isMarkingAllRead}>
            Mark all read
          </Button>
          <Button onClick={() => refetch()} size="small">
            Refresh
          </Button>
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            List: {
              colorPrimary: "[#111826]",
            },
          },
        }}
      >
        <div className="bg-transparent">
          {isError ? (
            <div className="text-center text-red-600 py-10">{errorMessage}</div>
          ) : null}
          <List
            split={false}
            loading={isLoading}
            dataSource={items}
            renderItem={(item) => (
              <div
                onClick={() => !item.read && markRead(item.id, true)}
                className={`group flex items-start justify-between gap-4 p-4 border border-gray-200 bg-white rounded-lg mb-3 transition hover:shadow-sm cursor-pointer ${
                  item.read ? "opacity-90" : ""
                }`}
              >
                {/* Unread Accent Bar */}
                <div
                  className={`w-1 rounded-full self-stretch ${
                    item.read ? "bg-transparent" : "bg-[#111826]"
                  }`}
                />

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base md:text-lg font-semibold text-[#111826]">
                      {item.title}
                    </h4>
                    <span className="text-xs md:text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0">
                      {item.time}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1 pr-2">
                      {item.description}
                    </p>
                  )}
                  {!item.read && (
                    <p className="text-[12px] text-[#111826] mt-1">New</p>
                  )}
                </div>

                {/* Actions (show on hover) */}
               
              </div>
            )}
          />
          {!isLoading && items.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No notifications
            </div>
          )}
        </div>
      </ConfigProvider>
    </div>
  );
}
