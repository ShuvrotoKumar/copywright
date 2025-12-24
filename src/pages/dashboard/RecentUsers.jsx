import { ConfigProvider, Modal, Table } from "antd";
import { FaRegEye } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { MdBlock } from "react-icons/md";
import { useGetAllUserQuery } from "../../redux/api/userApi";

const RecentUsers = () => {
  // Mock data to prevent API errors
  const usersData = { 
    data: { 
      users: [
        { _id: '1', fullname: 'John Doe', email: 'john@example.com', mobile: '123-456-7890', createdAt: '2024-01-15' },
        { _id: '2', fullname: 'Jane Smith', email: 'jane@example.com', mobile: '098-765-4321', createdAt: '2024-01-10' },
        { _id: '3', fullname: 'Bob Johnson', email: 'bob@example.com', mobile: '555-123-4567', createdAt: '2024-01-05' },
      ] 
    } 
  };
  const isLoading = false;
  const error = null;
  
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
          components: {
            InputNumber: {
              activeBorderColor: "[#111826]",
            },

            Table: {
              headerBg: "[#111826]",
              headerColor: "[#111826]",
              cellFontSize: 16,
              headerSplitColor: "[#111826]",
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
