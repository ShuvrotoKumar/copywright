import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaQuestionCircle, FaChevronUp, FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { ConfigProvider, Table, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useUpdateFaqMutation,
} from "../../redux/api/faqApi";

const Faq = () => {
  const { data: faqs, isLoading, isError, error } = useGetAllFaqQuery();
  const [createFaq] = useCreateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const navigate = useNavigate();

  const faqData = faqs?.data?.faqs || faqs?.data || faqs || [];
  
  const filteredFaqs = faqData.filter(faq => 
    faq.question && faq.answer && (
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddFaq = async () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      try {
        console.log('Sending FAQ data:', [newFaq]);
        await createFaq([newFaq]).unwrap();
        message.success('FAQ added successfully');
        setNewFaq({ question: "", answer: "" });
        setIsAddModalOpen(false);
      } catch (error) {
        console.error('FAQ creation error:', error);
        message.error(error?.data?.message || 'Failed to add FAQ');
      }
    }
  };

  const handleDeleteFaq = async () => {
    if (faqToDelete) {
      try {
        await deleteFaq({ _id: faqToDelete._id }).unwrap();
        message.success('FAQ deleted successfully');
        setIsDeleteModalOpen(false);
        setFaqToDelete(null);
      } catch (error) {
        message.error('Failed to delete FAQ');
      }
    }
  };

  const handleEditFaq = async () => {
    if (editingFaq && editingFaq.question.trim() && editingFaq.answer.trim()) {
      try {
        console.log('Updating FAQ data:', [editingFaq]);
        await updateFaq({ _id: editingFaq._id, data: editingFaq }).unwrap();
        message.success('FAQ updated successfully');
        setEditingFaq(null);
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('FAQ update error:', error);
        message.error(error?.data?.message || 'Failed to update FAQ');
      }
    }
  };

  const openDeleteModal = (faq) => {
    setFaqToDelete(faq);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq({ ...faq });
    setIsEditModalOpen(true);
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (text) => (
        <span className="text-gray-800 text-base">{text}</span>
      ),
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      render: (text) => (
        <span className="text-gray-600 text-base">{text}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button 
            onClick={() => openEditModal(record)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
            title="Edit FAQ"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => openDeleteModal(record)}
            className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
            title="Delete FAQ"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3 shadow-md">
        <button
          onClick={() => navigate('/settings')}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">FAQ Management</h1>
        {/* Mobile search */}
        
        <div className="ml-0 md:ml-auto flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-700"
          >
            <FaPlus /> Add FAQ
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
              headerBg: "#f9fafb",
              headerColor: "#000000",
              cellFontSize: 16,
              headerSplitColor: "#f9fafb",
              colorTextHeading: "#000000",
            },
            Modal: {
              contentBg: "#ffffff",
              headerBg: "#ffffff",
              titleColor: "#111827",
              titleFontSize: 20,
              titleLineHeight: 1.2,
              borderRadius: 8,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
          },
        }}
      >
        <Table
          dataSource={filteredFaqs}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
        {isError && (
          <div className="text-center text-red-600 py-4">
            {error?.data?.message || "Failed to load FAQs. Please try again."}
          </div>
        )}
      </ConfigProvider>

      <Modal
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Add New FAQ</h2>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setNewFaq({ question: "", answer: "" });
        }}
        footer={null}
        width={672}
        className="faq-modal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter question"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter answer"
              rows="3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              setNewFaq({ question: "", answer: "" });
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFaq}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add FAQ
          </button>
        </div>
      </Modal>

      <Modal
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Edit FAQ</h2>
          </div>
        }
        open={isEditModalOpen && editingFaq}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingFaq(null);
        }}
        footer={null}
        width={672}
        className="faq-modal"
      >
        {editingFaq && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                value={editingFaq.question}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter question"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                value={editingFaq.answer}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter answer"
                rows="3"
              />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setEditingFaq(null);
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEditFaq}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      <Modal
        title="Delete FAQ"
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setFaqToDelete(null);
        }}
        footer={[
          <button
            key="cancel"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setFaqToDelete(null);
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>,
          <button
            key="delete"
            onClick={handleDeleteFaq}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>,
        ]}
        width={400}
        className="faq-modal"
      >
        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to delete the FAQ "{faqToDelete?.question}"? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Faq;