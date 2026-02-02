import { ConfigProvider, Modal, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { IoChevronBack, IoAddOutline, IoTrash } from "react-icons/io5";
import { useDeleteAdminMutation, useGetAllAdminQuery } from "../../redux/api/adminApi";
import dayjs from "dayjs";
import { getImageUrl } from "../../config/envConfig";

export default function CreateAdmin() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAllAdminQuery();
  const [deleteAdmin] = useDeleteAdminMutation();

  const admins = useMemo(() => data?.data || [], [data]);

  const dataSource = useMemo(() => {
    return admins.map((admin, index) => ({
      key: admin._id,
      id: admin._id,
      no: index + 1,
      name: admin.fullname,
      email: admin.email,
      designation: admin.role,
      avatar: admin.avatar,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }));
  }, [admins]);

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img src={getImageUrl(avatar)} alt="avatar" className="w-10 h-10 rounded-full" />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => dayjs(updatedAt).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <button
          type="button"
          onClick={() => {
            Modal.confirm({
              title: "Delete Admin",
              content: `Are you sure you want to delete ${record?.name || "this admin"}?`,
              okText: "Delete",
              cancelText: "Cancel",
              okButtonProps: { danger: true },
              onOk: async () => {
                try {
                  await deleteAdmin(record.id).unwrap();
                  message.success("Admin deleted successfully");
                } catch {
                  message.error("Failed to delete admin");
                }
              },
            });
          }}
          className="p-2 hover:bg-red-100 rounded-md"
          title="Delete Admin"
        >
          <IoTrash className="text-red-500 w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-5">
      <div className="bg-[#111826] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-2xl font-bold">Admin List</h1>
        <button
          type="button"
          onClick={() => navigate("/add-admin")}
          className="ml-auto bg-white text-[#111826] px-3 py-1 rounded-md font-semibold flex items-center gap-2 hover:opacity-95 transition"
        >
          <IoAddOutline className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "[#111826]",
              headerColor: "[#111826]",
              cellFontSize: 16,
              headerSplitColor: "[#111826]",
            },
            Pagination: {
              colorPrimaryBorder: "#111827",
              colorBorder: "#111827",
              colorPrimaryHover: "#111827",
              colorTextPlaceholder: "#111827",
              itemActiveBgDisabled: "#111827",
              colorPrimary: "#111827",
            },
          },
        }}
      >
        {isError && <div className="text-red-500 text-center my-4">{error?.data?.message || "Failed to load admins."}</div>}
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </ConfigProvider>
    </div>
  );
}
