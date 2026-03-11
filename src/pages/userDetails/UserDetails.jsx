import { ConfigProvider, Modal, Table, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { MdBlock, MdLockOpen } from "react-icons/md";
import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useGetAllUserQuery,
  useGetBlockedUsersQuery,
  useGetSingleUserQuery,
  useUnBlockUserMutation,
} from "../../redux/api/userApi";
import { IoSearch, IoChevronBack, IoAddOutline, IoTrash } from "react-icons/io5";
import dayjs from "dayjs";
import toast from "react-hot-toast";

function UserDetails() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useGetAllUserQuery({
    page: currentPage,
    limit: pageSize,
  });
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
  const [isBlockedUsersModalOpen, setIsBlockedUsersModalOpen] = useState(false);
  const [reopenBlockedList, setReopenBlockedList] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blockedUsersPage, setBlockedUsersPage] = useState(1);
  const { data: blockedUsersData, isLoading: isBlockedUsersLoading } = useGetBlockedUsersQuery({
    page: blockedUsersPage,
    limit: 10,
  });
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showViewModal = (user) => {
    setSelectedUser(user);
    if (isBlockedUsersModalOpen) {
      setIsBlockedUsersModalOpen(false);
      setReopenBlockedList(true);
    }
    setIsViewModalOpen(true);
  };
  const handleViewCancel = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
    if (reopenBlockedList) {
      setIsBlockedUsersModalOpen(true);
      setReopenBlockedList(false);
    }
  };

  const {
    data: singleUserData,
    isLoading: isSingleUserLoading,
    isError: isSingleUserError,
    error: singleUserError,
  } = useGetSingleUserQuery(selectedUser?.key, {
    skip: !isViewModalOpen || !selectedUser?.key,
  });
  const [dataSource, setDataSource] = useState([]);

  const users = Array.isArray(data?.data?.users) ? data.data.users : [];
  const pagination = data?.data?.pagination;

  useEffect(() => {
    setDataSource(
      users.map((u, idx) => {
        const key = u?._id || u?.id || u?.userId || String(idx + 1);
        const firstName = u?.firstName || "";
        const lastName = u?.lastName || "";
        const computedName = `${firstName} ${lastName}`.trim();

        return {
          key,
          fullName: u?.fullname || u?.fullName || u?.name || computedName || "N/A",
          role: u?.role || u?.userType || "User",
          clinic: u?.company || u?.clinic || u?.clinicName || u?.businessName || "",
          email: u?.email || "",
          phone: u?.mobile || u?.phoneNumber || "",
          joined: u?.joined || u?.createdAt || u?.joinDate || "",
          isBlocked: u?.isBlocked || false,
          street: u?.street || "",
          houseNumber: u?.houseNumber || "",
          zipCode: u?.zipCode || "",
          city: u?.city || "",
          country: u?.country || "",
          hasEverSubscribed: u?.hasEverSubscribed || false,
          hasEverUsedCoupon: u?.hasEverUsedCoupon || false,
          subscriptionType: u?.subscriptionType,
          isPremiumMember: u?.isPremiumMember || false,
        };
      })
    );
  }, [users]);
  const columns = [
    {
      title: "No",
      key: "no",
      width: 70,
      render: (_, _r, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (value) => (
        <div className="flex items-center gap-2">
          <p className="leading-none">{value}</p>
        </div>
      ),
    },
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

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, searchQuery]);

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

  const openDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const userId = selectedUser?.key || selectedUser?._id;
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (e) {
      const message = e?.data?.message || e?.error || "Failed to delete user.";
      toast.error(message);
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
          <button
            onClick={() => setIsBlockedUsersModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
          >
            Blocked User
          </button>
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
          pagination={{
            current: pagination?.currentPage ?? currentPage,
            pageSize: pagination?.usersPerPage ?? pageSize,
            total: pagination?.totalUsers ?? 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, nextPageSize) => {
              setCurrentPage(page);
              if (typeof nextPageSize === "number" && nextPageSize !== pageSize) {
                setPageSize(nextPageSize);
                setCurrentPage(1);
              }
            },
          }}
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
              {isSingleUserLoading ? (
                <div className="py-10 text-center">Loading...</div>
              ) : isSingleUserError ? (
                <div className="py-3 text-center text-red-600">
                  {singleUserError?.data?.message || singleUserError?.error || "Failed to load user."}
                </div>
              ) : (
                (() => {
                  const user = singleUserData?.data?.user;
                  const displayName = user?.fullname || selectedUser.fullName;
                  const joinedDate = user?.createdAt || selectedUser.joined;
                  const email = user?.email || selectedUser.email;
                  const mobile = user?.mobile || selectedUser.phone;
                  const role = user?.role || selectedUser.role;
                  const company = user?.company || selectedUser.clinic || "";
                  const street = user?.street || selectedUser.street || "";
                  const houseNumber = user?.houseNumber || selectedUser.houseNumber || "";
                  const city = user?.city || selectedUser.city || "";
                  const country = user?.country || selectedUser.country || "";
                  
                  const isPremiumMember = typeof user?.isPremiumMember === 'boolean' ? user.isPremiumMember : selectedUser.isPremiumMember;
                  const hasEverSubscribed = typeof user?.hasEverSubscribed === 'boolean' ? user.hasEverSubscribed : selectedUser.hasEverSubscribed;
                  const hasEverUsedCoupon = typeof user?.hasEverUsedCoupon === 'boolean' ? user.hasEverUsedCoupon : selectedUser.hasEverUsedCoupon;
                  
                  const isBlocked = typeof user?.isBlocked === "boolean" ? user.isBlocked : selectedUser.isBlocked;
                  const updatedAt = user?.updatedAt;
                  const subscriptionType = user?.subscriptionType !== undefined ? user.subscriptionType : selectedUser.subscriptionType;

                  return (
                    <>
              {/* Header with blue-black background */}
              <div className="bg-[#111826] p-6 -m-6 mb-6 rounded-t-lg">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={`https://avatar.iran.liara.run/public/${selectedUser.key}`}
                      alt={displayName}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      {displayName}
                    </h2>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        Joined: {joinedDate ? dayjs(joinedDate).format("DD/MM/YYYY") : "N/A"}
                      </span>
                      {isPremiumMember && (
                        <span className="bg-yellow-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Email</div>
                  <div className="text-base font-semibold text-[#111826]">
                    {email || "N/A"}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Phone No</div>
                  <div className="text-base font-semibold text-[#111826]">
                    {mobile || "N/A"}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Role</div>
                  <div className="text-base font-semibold text-[#111826]">{role || "User"}</div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Company</div>
                  <div className="text-base font-semibold text-[#111826]">{company || "N/A"}</div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Subscription Type</div>
                  <div className="text-base font-semibold text-[#111826]">
                    {subscriptionType !== undefined ? `Type ${subscriptionType}` : "None"}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Status</div>
                  <div className={`text-base font-semibold ${isBlocked ? "text-red-600" : "text-green-600"}`}>
                    {isBlocked ? "Blocked" : "Active"}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm md:col-span-3">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Address Information</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-1">
                    <div>
                      <div className="text-gray-400 text-[10px] uppercase font-bold">Street</div>
                      <div className="text-sm font-medium">{street || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-[10px] uppercase font-bold">House No</div>
                      <div className="text-sm font-medium">{houseNumber || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-[10px] uppercase font-bold">City</div>
                      <div className="text-sm font-medium">{city || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-[10px] uppercase font-bold">Country</div>
                      <div className="text-sm font-medium">{country || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col justify-center items-center text-center">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1 text-start w-full">Usage Coupon</div>
                  <div className={`text-sm font-bold mt-1 px-3 py-1 rounded-full ${hasEverUsedCoupon ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {hasEverUsedCoupon ? "USED COUPON" : "NO COUPON"}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col justify-center items-center text-center">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1 text-start w-full">Subscription History</div>
                  <div className={`text-sm font-bold mt-1 px-3 py-1 rounded-full ${hasEverSubscribed ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                    {hasEverSubscribed ? "PREVIOUSLY SUBSCRIBED" : "NEVER SUBSCRIBED"}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Updated At</div>
                  <div className="text-base font-semibold text-[#111826]">
                    {updatedAt ? dayjs(updatedAt).format("DD/MM/YYYY HH:mm") : "N/A"}
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
                    </>
                  );
                })()
              )}
            </div>
          )}
        </Modal>

        {/* Blocked Users List Modal */}
        <Modal
          title={<span className="text-xl font-bold">Blocked Users List</span>}
          open={isBlockedUsersModalOpen}
          onCancel={() => {
            setIsBlockedUsersModalOpen(false);
            setReopenBlockedList(false);
          }}
          footer={null}
          width={1000}
          centered
        >
          <Table
            dataSource={blockedUsersData?.data?.blockedUsers?.map((u, idx) => ({
              key: u._id,
              no: (blockedUsersPage - 1) * 10 + idx + 1,
              fullName: u.fullname || "N/A",
              email: u.email || "N/A",
              phone: u.mobile || "N/A",
              isBlocked: true,
            }))}
            columns={[
              { title: "No", dataIndex: "no", key: "no", width: 60 },
              { title: "Full Name", dataIndex: "fullName", key: "fullName" },
              { title: "Email", dataIndex: "email", key: "email" },
              { title: "Phone No", dataIndex: "phone", key: "phone" },
              {
                title: "Action",
                key: "action",
                render: (_, record) => (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openBlock(record)}
                      title="Unblock User"
                    >
                      <MdLockOpen className="text-green-500 w-5 h-5 cursor-pointer rounded-md" />
                    </button>
                    <button 
                      onClick={() => openDelete(record)}
                      title="Delete User"
                    >
                      <IoTrash className="text-red-500 w-5 h-5 cursor-pointer rounded-md" />
                    </button>
                    <button onClick={() => showViewModal(record)}>
                      <FaRegEye className="text-[#111827] w-5 h-5 cursor-pointer rounded-md" />
                    </button>
                  </div>
                ),
              },
            ]}
            loading={isBlockedUsersLoading}
            pagination={{
              current: blockedUsersData?.data?.pagination?.currentPage || blockedUsersPage,
              pageSize: blockedUsersData?.data?.pagination?.blockedUsersPerPage || 10,
              total: blockedUsersData?.data?.pagination?.totalBlockedUsers || 0,
              onChange: (page) => setBlockedUsersPage(page),
            }}
            scroll={{ x: "max-content" }}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={isDeleteModalOpen}
          centered
          onCancel={() => setIsDeleteModalOpen(false)}
          footer={null}
        >
          <div className="flex flex-col justify-center items-center py-10">
            <h1 className="text-3xl text-center text-[#111827]">Delete User</h1>
            <p className="text-xl text-center mt-5 text-gray-600">
              Are you sure you want to delete <span className="font-bold">{selectedUser?.fullName}</span>? This action cannot be undone.
            </p>
            <div className="text-center py-5 flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-800 text-white font-semibold py-3 px-5 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeletingUser}
                className="bg-red-600 text-white font-semibold py-3 px-5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeletingUser ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}

export default UserDetails;
