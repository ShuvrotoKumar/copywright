import { ConfigProvider, Modal, Table } from "antd";
import { FaRegEye } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { useGetRecentUserQuery } from "../../redux/api/userApi";

const RecentUsers = () => {
  const { data: usersData, isLoading, error } = useGetRecentUserQuery();

  const dataSource = usersData?.data?.users?.map((user, index) => ({
    key: user._id || index.toString(),
    fullName: user.fullname || 'N/A',
    role: user.role || 'N/A',
    clinic: 'N/A',
    email: user.email || 'N/A',
    phone: user.mobile || 'N/A',
    joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
  })) || [];

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
        <div className="flex items-center gap-3">
          <img
            src={`https://avatar.iran.liara.run/public/${record.key}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span className="leading-none">{value}</span>
        </div>
      ),
    },
    // { title: "Role", dataIndex: "role", key: "role" },
    // { title: "Clinic", dataIndex: "clinic", key: "clinic" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phone", key: "phone" },
    { title: "Joined Date", dataIndex: "joined", key: "joined" },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "transparent",
          },
          components: {
            Table: {
              headerBg: "transparent",
              headerColor: "#111826",
              cellFontSize: 14,
              headerSplitColor: "transparent",
              rowHoverBg: "#ffffff",
            },
          },
        }}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </ConfigProvider>
    </>
  );
};

export default RecentUsers;
