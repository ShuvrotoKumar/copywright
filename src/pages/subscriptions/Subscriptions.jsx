import { ConfigProvider, Table, Modal, Button, Tag, Select, Input } from "antd";
import { useState, useMemo } from "react";
import { IoSearch, IoChevronBack, IoAdd, IoEllipsisVertical } from "react-icons/io5";
import { FaRegEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetSubscriptionPlansQuery, useUpdateSubscriptionPlanMutation } from "../../redux/api/subscriptionApi";
import dayjs from "dayjs";

const { Option } = Select;

function Subscriptions() {
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [role] = useState("admin"); // Set default role

  // API hooks
  const { data: subscriptionData, isLoading, isError, error } = useGetSubscriptionPlansQuery({ role });
  const [updateSubscriptionPlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();

  // Debug: Log the API response
  console.log("Subscription API Response:", subscriptionData);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // Process subscription data from API
  const subscriptions = useMemo(() => {
    if (!subscriptionData?.data?.plans) return [];
    
    let data = subscriptionData.data.plans;
    
    if (!Array.isArray(data)) {
      console.log("Data is not an array:", data);
      return [];
    }

    console.log("Processing subscription data:", data);

    // Apply search filter
    if (searchTerm) {
      data = data.filter(
        (sub) =>
          (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (sub.planType && sub.planType.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (sub.subscriptionType && sub.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter (using isActive instead of status)
    if (statusFilter !== "all") {
      data = data.filter((sub) => {
        if (statusFilter === "active") return sub.isActive;
        return false;
      });
    }

    return data;
  }, [subscriptionData, searchTerm, statusFilter]);

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-semibold">{name}</span>,
    },
    {
      title: "Plan Type",
      dataIndex: "planType",
      key: "planType",
      render: (type) => <span className="capitalize">{type}</span>,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <div>
          <span className="font-semibold">€{record.price}</span>
          <span className="text-gray-500 text-sm ml-1">/{record.billingCycle === 'monthly' ? 'month' : 'one-time'}</span>
        </div>
      ),
    },
    {
      title: "Account Limit",
      dataIndex: "accountLimit",
      key: "accountLimit",
      render: (limit) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {limit} account{limit > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      title: "Subscription Type",
      dataIndex: "subscriptionType",
      key: "subscriptionType",
      render: (type) => (
        <Tag color={type === 'recurring' ? 'blue' : 'green'}>
          {type === 'recurring' ? 'Monthly' : 'One-time'}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => showViewModal(record)}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="View Plan"
          >
            <FaRegEye className="text-gray-600 w-4 h-4" />
          </button>
          <button
            onClick={() => showEditModal(record)}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Edit Plan"
          >
            <FaEdit className="text-blue-500 w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const showViewModal = (subscription) => {
    setSelectedSubscription(subscription);
    setIsViewModalOpen(true);
  };

  const showEditModal = (subscription) => {
    setSelectedSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleCancelSubscription = (subscription) => {
    console.log("Deleting plan:", subscription._id);
    // Add API call to delete plan
  };

  const handleEditSubscription = async (values) => {
    if (!selectedSubscription?._id) return;

    try {
      await updateSubscriptionPlan({
        subscriptionId: selectedSubscription._id,
        role,
        data: values,
      }).unwrap();

      setIsEditModalOpen(false);
      setSelectedSubscription(null);
      // You can add a success notification here
    } catch (error) {
      console.error("Failed to update subscription:", error);
      // You can add an error notification here
    }
  };

  return (
    <div className="p-6">
      <div className="bg-[#111826] px-5 py-3 rounded-md mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-2xl font-bold">Subscriptions</h1>
        </div>
        {/* <Button
          type="primary"
          icon={<IoAdd className="w-5 h-5" />}
          className="bg-white hover:bg-white flex items-center gap-2"
        >
          Add Subscription
        </Button> */}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 flex justify-between items-center gap-4">
          <div className="flex gap-4">
            <div className="relative w-80">
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<IoSearch className="text-gray-400" />}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
              placeholder="Filter by status"
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </div>

        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#f9fafb",
                headerColor: "#111826",
                headerBorderRadius: 8,
                rowHoverBg: "#f3f4f6",
                colorText: "#1f2937",
                colorLink: "#2563eb",
                colorLinkHover: "#1d4ed8",
                colorLinkActive: "#1e40af",
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
          {isError && <div className="text-red-500 text-center my-4">{error?.data?.message || "Failed to load subscriptions."}</div>}
          <Table
            dataSource={subscriptions}
            columns={columns}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            rowKey="_id"
          />
        </ConfigProvider>
      </div>

      {/* View Subscription Modal */}
      <Modal
        title="Subscription Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedSubscription && (
          <div className="py-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold">{selectedSubscription.name}</h3>
                <p className="text-gray-500">Plan Type: {selectedSubscription.planType}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${selectedSubscription.price}</div>
                <Tag color={selectedSubscription.isActive ? "green" : "red"}>
                  {selectedSubscription.isActive ? "Active" : "Inactive"}
                </Tag>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Plan Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><strong>Name:</strong> {selectedSubscription.name}</p>
                  <p><strong>Type:</strong> <span className="capitalize">{selectedSubscription.planType}</span></p>
                  <p><strong>Subscription:</strong> {selectedSubscription.subscriptionType === 'recurring' ? 'Monthly' : 'One-time'}</p>
                  <p><strong>Account Limit:</strong> {selectedSubscription.accountLimit}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Pricing Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><strong>Price:</strong> ${selectedSubscription.price}</p>
                  <p><strong>Billing Cycle:</strong> <span className="capitalize">{selectedSubscription.billingCycle}</span></p>
                  <p><strong>Created:</strong> {dayjs(selectedSubscription.createdAt).format("DD/MM/YYYY")}</p>
                  <p><strong>Last Updated:</strong> {dayjs(selectedSubscription.updatedAt).format("DD/MM/YYYY")}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Plan Features</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc list-inside space-y-1">
                  {selectedSubscription.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={() => setIsViewModalOpen(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  showEditModal(selectedSubscription);
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Edit Plan
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal
        title="Edit Subscription"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => handleEditSubscription(selectedSubscription)}
        okText="Save Changes"
        cancelText="Cancel"
        confirmLoading={isUpdating}
        width={600}
      >
        {selectedSubscription && (
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name
                </label>
                <Input
                  value={selectedSubscription.name}
                  onChange={(e) =>
                    setSelectedSubscription({
                      ...selectedSubscription,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Type
                </label>
                <Input
                  value={selectedSubscription.planType}
                  onChange={(e) =>
                    setSelectedSubscription({
                      ...selectedSubscription,
                      planType: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  value={selectedSubscription.price}
                  onChange={(e) =>
                    setSelectedSubscription({
                      ...selectedSubscription,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Limit
                </label>
                <Input
                  type="number"
                  value={selectedSubscription.accountLimit}
                  onChange={(e) =>
                    setSelectedSubscription({
                      ...selectedSubscription,
                      accountLimit: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={selectedSubscription.isActive}
                  onChange={(value) =>
                    setSelectedSubscription({
                      ...selectedSubscription,
                      isActive: value,
                    })
                  }
                  className="w-full"
                >
                  <Option value={true}>Active</Option>
                  <Option value={false}>Inactive</Option>
                </Select>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Subscriptions;