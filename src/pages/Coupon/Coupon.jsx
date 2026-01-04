import { ConfigProvider, Modal, message, Switch, Spin } from "antd";
import { useState, useMemo, useEffect } from "react";
import { IoSearch, IoChevronBack, IoTicketOutline, IoTrash, IoCreateOutline } from "react-icons/io5";
import { FaRegEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  useGet_all_couponQuery,
  useCreate_couponMutation,
  useUpdate_couponMutation,
  useDelete_couponMutation,
} from "../../redux/api/couponApi";

function Coupon() {
  const navigate = useNavigate();
  const { data: coupons, isLoading, isError, error } = useGet_all_couponQuery({ page: 1 });
  const [createCoupon] = useCreate_couponMutation();
  const [deleteCoupon] = useDelete_couponMutation();
  const [updateCoupon] = useUpdate_couponMutation();
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercentage: 10 });
  const [searchTerm, setSearchTerm] = useState("");

  const couponData = Array.isArray(coupons?.data?.coupons) ? coupons.data.coupons : [];

  const filteredCoupons = useMemo(() => {
    return couponData.filter(coupon => 
      coupon.code && (
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [couponData, searchTerm]);

  const handleToggleStatus = async (coupon, isActive) => {
    try {
      await updateCoupon({ 
        _id: coupon._id, 
        data: { ...coupon, isActive } 
      }).unwrap();
      message.success(`Coupon ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      message.error('Failed to update coupon status');
    }
  };

  const showViewModal = (coupon) => {
    setSelectedCoupon(coupon);
    setIsViewModalOpen(true);
  };

  const showEditModal = (coupon) => {
    const defaultCoupon = {
      code: '',
    };
    setSelectedCoupon(coupon._id ? coupon : defaultCoupon);
    setIsEditModalOpen(true);
  };

  const showDeleteModal = (coupon) => {
    setCouponToDelete(coupon);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCoupon = async () => {
    try {
      if (!couponToDelete || !couponToDelete._id) {
        message.error('No coupon selected for deletion');
        return;
      }
      
      await deleteCoupon({ _id: couponToDelete._id }).unwrap();
      message.success('Coupon deleted successfully');
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete coupon');
    }
  };

  const handleCreateCoupon = async () => {
    try {
      await createCoupon(newCoupon).unwrap();
      message.success('Coupon created successfully');
      setIsCreateModalOpen(false);
      setNewCoupon({ code: '', discountPercentage: 10 });
    } catch (error) {
      console.error('Create coupon error:', error);
      message.error('Failed to create coupon');
    }
  };

  const handleUpdateCoupon = async (couponData) => {
    try {
      await updateCoupon({ _id: couponData._id, data: couponData }).unwrap();
      message.success('Coupon updated successfully');
      setIsEditModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error('Update coupon error:', error);
      message.error('Failed to update coupon');
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
          <h1 className="text-white text-2xl font-bold">Coupon Management</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-gray-100 text-[#111826] px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <IoCreateOutline className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 flex justify-end">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-600 py-10">
            {error?.data?.message || "Failed to load coupons. Please try again."}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <IoTicketOutline className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No coupons found</p>
            <p className="text-sm mt-2">Create your first coupon to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gray-800 p-4 text-white flex items-center justify-between">
                  <IoTicketOutline className="w-6 h-6" />
                  <span className="text-sm font-medium">
                    {coupon.discountPercentage}% OFF
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-center py-4">
                      <h3 className="text-3xl font-bold tracking-wider text-gray-800 text-center">
                        {coupon.code}
                      </h3>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showEditModal(coupon);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 text-gray-700 hover:text-gray-900 p-2 rounded hover:bg-gray-100 transition-colors"
                      title="Edit Coupon"
                    >
                      <FaEdit className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showDeleteModal(coupon);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Delete Coupon"
                    >
                      <IoTrash className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Coupon Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoTicketOutline className="w-6 h-6 text-[#111826]" />
            <span>Coupon Details</span>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedCoupon && (
          <div className="py-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold">{selectedCoupon.code}</h3>
                <p className="text-gray-500">Created on {dayjs(selectedCoupon.createdAt).format('MMM DD, YYYY')}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedCoupon.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedCoupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Discount Percentage</span>
                <span className="font-semibold text-green-600">{selectedCoupon.discountPercentage}% OFF</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${selectedCoupon.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedCoupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Created By</span>
                <span className="font-medium">{selectedCoupon.createdBy || 'System'}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Created Date</span>
                <span className="font-medium">{dayjs(selectedCoupon.createdAt).format('MMM DD, YYYY HH:mm')}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{dayjs(selectedCoupon.updatedAt).format('MMM DD, YYYY HH:mm')}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Coupon Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoCreateOutline className="w-6 h-6 text-[#111826]" />
            <span>Create Coupon</span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={500}
      >
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon code"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newCoupon.discountPercentage}
                onChange={(e) => setNewCoupon({...newCoupon, discountPercentage: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter discount percentage"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCoupon}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Coupon
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Coupon Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoCreateOutline className="w-6 h-6 text-[#111826]" />
            <span>{selectedCoupon?._id ? 'Edit Coupon' : 'Create Coupon'}</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={500}
      >
        {selectedCoupon && (
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={selectedCoupon.code}
                  onChange={(e) => setSelectedCoupon({...selectedCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter coupon code"
                />
              </div>
              
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedCoupon._id) {
                    handleUpdateCoupon(selectedCoupon);
                  } else {
                    handleCreateCoupon(selectedCoupon);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedCoupon._id ? 'Save Changes' : 'Create Coupon'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Coupon Modal */}
      <Modal
        title="Delete Coupon"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <button
            key="cancel"
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>,
          <button
            key="delete"
            onClick={handleDeleteCoupon}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>,
        ]}
      >
        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to delete the coupon "{couponToDelete?.code}"? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Coupon;