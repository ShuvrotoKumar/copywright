import { ConfigProvider, Modal, Table, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { MdBlock, MdLockOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { useBlockUserMutation, useGetAllUserQuery, useUnBlockUserMutation } from "../../redux/api/userApi";
import dayjs from "dayjs";
import toast from "react-hot-toast";

function UserDetails() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAllUserQuery();
  const [blockUser, { isLoading: isBlockingUser }] = useBlockUserMutation();
  const [unBlockUser, { isLoading: isUnblockingUser }] = useUnBlockUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false); // block modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [blockError, setBlockError] = useState("");
  const [roleFilter, setRoleFilter] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };
  const [dataSource, setDataSource] = useState([]);

  const users = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.users)
        ? data.data.users
        : Array.isArray(data?.users)
          ? data.users
          : [];

  useEffect(() => {
    setDataSource(
      users.map((u, idx) => {
        const key = u?._id || u?.id || u?.userId || String(idx + 1);
        const firstName = u?.firstName || "";
        const lastName = u?.lastName || "";
        const computedName = `${firstName} ${lastName}`.trim();

        return {
          key,
          fullName: u?.fullName || u?.name || computedName || "N/A",
          role: u?.role || u?.userType || "User",
          clinic: u?.clinic || u?.clinicName || u?.businessName || "",
          email: u?.email || "",
          phone: u?.mobile || u?.phoneNumber || "",
          joined: u?.joined || u?.createdAt || u?.joinDate || "",
          isBlocked: u?.isBlocked || false,
        };
      })
    );
  }, [users]);
  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (value, record) => (
       
          <p className="leading-none">{value}</p>
     
      ),
    },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phone", key: "phone" },
    { 
      title: "Joined Date", 
      dataIndex: "joined", 
      key: "joined",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "isBlocked",
      render: (isBlocked) => (
        <span className={isBlocked ? "text-red-500" : "text-green-500"}>
          {isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button className="" onClick={() => openBlock(record)}>
            {record.isBlocked ? (
              <MdLockOpen className="text-green-500 w-5 h-5 cursor-pointer rounded-md" />
            ) : (
              <MdBlock className="text-red-500 w-5 h-5 cursor-pointer rounded-md" />
            )}
          </button>
          <button className="" onClick={() => showViewModal(record)}>
            <FaRegEye className="text-[#111827] w-5 h-5 cursor-pointer rounded-md" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    return dataSource.filter((r) => {
      const matchRole = roleFilter ? r.role === roleFilter : true;
      const matchQuery = q
        ? [r.fullName, r.email, r.phone, r.clinic, r.role]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
        : true;
      return matchRole && matchQuery;
    });
  }, [dataSource, roleFilter, searchQuery]);

  const openBlock = (row) => {
    setSelectedUser(row);
    setBlockError("");
    setIsModalOpen(true);
  };

  const confirmBlock = async () => {
    setBlockError("");

    const userId = selectedUser?.key;
    if (!userId) {
      setBlockError("User id not found.");
      return;
    }

    try {
      if (selectedUser.isBlocked) {
        await unBlockUser(userId).unwrap();
        toast.success("User unblocked successfully!");
      } else {
        await blockUser(userId).unwrap();
        toast.success("User blocked successfully!");
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (e) {
      const message =
        e?.data?.message || e?.error || "Failed to update user status.";
      setBlockError(message);
    }
  };

  return (
    <div>
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">User Management</h1>
        {/* Mobile search */}
        <div className="relative w-full md:hidden mt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
          />
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="bg-white text-[#0D0D0D] placeholder-[#111827] pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111827]" />
          </div>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#00c0b5",
            },
            Pagination: {
              colorPrimaryBorder: "#111827",
              colorBorder: "#111827",
              colorPrimaryHover: "#111827",
              colorTextPlaceholder: "#111827",
              itemActiveBgDisabled: "#111827",
              colorPrimary: "#111827",
            },
            Table: {
              headerBg: "[#111826]",
              headerColor: "#000000", // Changed to black
              cellFontSize: 16,
              headerSplitColor: "[#111826]",
              colorTextHeading: "#000000", // Ensure header text is black
            },
          },
        }}
      >
        {isError ? (
          <div className="text-center text-red-600 py-3">
            {error?.data?.message || error?.error || "Failed to load users."}
          </div>
        ) : null}
        <Table
          dataSource={filteredData}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
        {/* Block Modal */}
        <Modal
          open={isModalOpen}
          centered
          onCancel={handleCancel}
          footer={null}
        >
          <div className="flex flex-col justify-center items-center py-10">
            <h1 className="text-3xl text-center text-[#111827]">
              {selectedUser?.isBlocked ? "Unblock User" : "Block User"}
            </h1>
            <p className="text-xl text-center mt-5">
              Are you sure?
            </p>
            {blockError ? (
              <div className="text-center text-red-600 mt-4">{blockError}</div>
            ) : null}
            <div className="text-center py-5 flex justify-center gap-3">
              <button
                onClick={handleCancel}
                className="bg-gray-800 text-white font-semibold py-3 px-5 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                disabled={isBlockingUser || isUnblockingUser}
                className={`${selectedUser?.isBlocked ? "bg-green-600" : "bg-red-600"} text-white font-semibold py-3 px-5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isBlockingUser || isUnblockingUser
                  ? selectedUser?.isBlocked
                    ? "Unblocking..."
                    : "Blocking..."
                  : selectedUser?.isBlocked
                  ? "Unblock"
                  : "Block"}
              </button>
            </div>
          </div>
        </Modal>

        {/* View Modal */}
        <Modal
          open={isViewModalOpen}
          centered
          onCancel={handleViewCancel}
          footer={null}
          width={800}
          className="user-view-modal"
        >
          {selectedUser && (
            <div className="relative">
              {/* Header with green gradient */}
              <div className="bg-[#111826] p-6 -m-6 mb-6 rounded-t-lg">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={`https://avatar.iran.liara.run/public/${selectedUser.key}`}
                      alt={selectedUser.fullName}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedUser.fullName}
                    </h2>
                    <div className="flex items-center gap-3 mb-1">
                      {/* <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {selectedUser.clinic}
                      </span> */}
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Joined: {selectedUser.joined ? dayjs(selectedUser.joined).format("DD/MM/YYYY") : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Email</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.email}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Phone No</div>
                  <div className="text-lg font-semibold">
                    {selectedUser.phone}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-black text-sm">Joined Date</div>
                                    <div className="text-lg font-semibold">
                    {selectedUser.joined ? dayjs(selectedUser.joined).format("DD/MM/YYYY") : "N/A"}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleViewCancel}
                  className="bg-[#111826] text-white font-semibold px-8 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default UserDetails;
