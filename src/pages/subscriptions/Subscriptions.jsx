import { Modal, Button, Select, Input, Spin } from "antd";
import { useState, useMemo } from "react";
import { IoChevronBack } from "react-icons/io5";
import { FaEdit, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useGetSubscriptionPlansQuery,
  useUpdateSubscriptionPlanMutation,
} from "../../redux/api/subscriptionApi";

const { Option } = Select;

function Subscriptions() {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [role] = useState("admin");

  // API hooks
  const {
    data: subscriptionData,
    isLoading,
    isError,
    error,
  } = useGetSubscriptionPlansQuery({ role });
  const [updateSubscriptionPlan, { isLoading: isUpdating }] =
    useUpdateSubscriptionPlanMutation();

  // Process subscription data from API
  const subscriptions = useMemo(() => {
    if (!subscriptionData?.data?.plans) return [];

    let data = subscriptionData.data.plans;

    if (!Array.isArray(data)) {
      console.log("Data is not an array:", data);
      return [];
    }

    // Apply status filter
    if (statusFilter !== "all") {
      data = data.filter((sub) => {
        if (statusFilter === "active") return sub.isActive;
        if (statusFilter === "inactive") return !sub.isActive;
        return true;
      });
    }

    return data;
  }, [subscriptionData, statusFilter]);

  const showEditModal = (subscription) => {
    setSelectedSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleEditSubscription = async () => {
    if (!selectedSubscription?._id) return;

    try {
      await updateSubscriptionPlan({
        subscriptionId: selectedSubscription._id,
        role,
        data: selectedSubscription,
      }).unwrap();

      setIsEditModalOpen(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error("Failed to update subscription:", error);
    }
  };

  return (
    <div>
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl sm:text-2xl font-bold">
            Subscription Plans
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-40"
            placeholder="Filter by status"
            dropdownStyle={{ borderRadius: '8px' }}
          >
            <Option value="all">All Plans</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
      </div>

        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-center py-4 rounded-lg mb-6">
            {error?.data?.message || "Failed to load subscriptions."}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription._id}
                className={`relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                  subscription.subscriptionType === "recurring"
                    ? "border-2 border-blue-500"
                    : "border border-gray-200"
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      subscription.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {subscription.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Plan Type Badge */}
                {subscription.subscriptionType === "recurring" && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white px-4 py-1 text-xs font-semibold">
                    MONTHLY
                  </div>
                )}

                {/* Card Content */}
                <div className="p-5 pt-10">
                  {/* Plan Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {subscription.name}
                  </h3>

                  {/* Plan Type */}
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">
                    {subscription.planType} Plan
                  </p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-extrabold text-gray-900">
                        €{subscription.price}
                      </span>
                      <span className="text-gray-500 ml-2 text-base">
                        /
                        {subscription.billingCycle === "monthly"
                          ? "mo"
                          : "once"}
                      </span>
                    </div>
                    {subscription.subscriptionType === "recurring" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Billed monthly
                      </p>
                    )}
                    {subscription.subscriptionType === "one-time" && (
                      <p className="text-xs text-gray-500 mt-1">
                        One-time payment
                      </p>
                    )}
                  </div>

                  {/* Account Limit */}
                  <div className="bg-blue-50 rounded-lg p-2.5 mb-4 text-center">
                    <p className="text-xs text-gray-600 mb-0.5">
                      Account Limit
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {subscription.accountLimit} Account
                      {subscription.accountLimit > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-5">
                    {subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <FaCheck className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => showEditModal(subscription)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Subscription
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && subscriptions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No subscription plans found.
            </p>
          </div>
        )}
 
      {/* Edit Subscription Modal */}
      <Modal
        title="Edit Subscription"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEditSubscription}
        okText="Save Changes"
        cancelText="Cancel"
        confirmLoading={isUpdating}
        width={500}
      >
        {selectedSubscription && (
          <div className="py-4">
            {/* Plan Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name
              </label>
              <Input
                size="large"
                value={selectedSubscription.name}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    name: e.target.value,
                  })
                }
                placeholder="Enter plan name"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (€)
              </label>
              <Input
                type="number"
                size="large"
                value={selectedSubscription.price}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    price: parseFloat(e.target.value),
                  })
                }
                prefix="€"
                placeholder="Enter price"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {selectedSubscription.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      size="large"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...selectedSubscription.features];
                        newFeatures[index] = e.target.value;
                        setSelectedSubscription({
                          ...selectedSubscription,
                          features: newFeatures,
                        });
                      }}
                      placeholder="Enter feature"
                    />
                    <button
                      onClick={() => {
                        const newFeatures =
                          selectedSubscription.features.filter(
                            (_, i) => i !== index,
                          );
                        setSelectedSubscription({
                          ...selectedSubscription,
                          features: newFeatures,
                        });
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setSelectedSubscription({
                      ...selectedSubscription,
                      features: [...(selectedSubscription.features || []), ""],
                    })
                  }
                  className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Subscriptions;
