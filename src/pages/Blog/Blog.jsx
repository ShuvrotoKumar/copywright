import { ConfigProvider, Modal, Table, message } from "antd";
import { useState, useMemo } from "react";
import { IoSearch, IoChevronBack, IoDocumentTextOutline, IoTrash, IoCreateOutline } from "react-icons/io5";
import { FaRegEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../../redux/api/blogApi";

function Blog() {
  const navigate = useNavigate();
  const { data: blogs, isLoading, isError, error } = useGetAllBlogsQuery();
  const [createBlog] = useCreateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const blogData = blogs?.data || [];
  
  const dataSource = useMemo(() => {
    return blogData.filter(blog => 
      blog.title && blog.publishedBy && (
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.publishedBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ).map(blog => ({
      key: blog._id,
      _id: blog._id,
      title: blog.title,
      author: blog.publishedBy,
      category: blog.category || 'General',
      date: blog.publishedDate,
      status: blog.status || 'Published',
      views: blog.views || 0,
      content: blog.body,
      coverImage: blog.coverImage,
    }));
  }, [blogData, searchTerm]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <div className="font-medium text-gray-900">{text}</div>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (text) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-[#111826] font-semibold">
              {text.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-gray-800 text-base">{text}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          {text}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <span className="text-gray-600">{dayjs(text).format('MMM DD, YYYY')}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            text === 'Published'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      render: (text) => (
        <span className="text-gray-600">{text ? text.toLocaleString() : '0'}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => showViewModal(record)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
            title="View Blog"
          >
            <FaRegEye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showEditModal(record);
            }}
            className="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50 transition-colors"
            title="Edit Blog"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              showDeleteModal(record);
            }}
            className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
            title="Delete Blog"
          >
            <IoTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const showViewModal = (blog) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  const showEditModal = (blog) => {
    const defaultBlog = {
      title: '',
      publishedBy: '',
      category: '',
      body: '',
      status: 'Draft',
      publishedDate: new Date().toISOString().split('T')[0],
      views: 0,
      coverImage: ''
    };
    setSelectedBlog(blog._id ? blog : defaultBlog);
    setIsEditModalOpen(true);
  };

  const showDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog({ _id: blogToDelete._id }).unwrap();
      message.success('Blog deleted successfully');
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      message.error('Failed to delete blog');
    }
  };

  const handleCreateBlog = async (blogData) => {
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('body', blogData.body);
      
      if (blogData.coverImage) {
        formData.append('coverImage', blogData.coverImage);
      }
      
      await createBlog(formData).unwrap();
      message.success('Blog created successfully');
      setIsEditModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      message.error('Failed to create blog');
    }
  };

  const handleUpdateBlog = async (blogData) => {
    try {
      await updateBlog({ _id: blogData._id, data: blogData }).unwrap();
      message.success('Blog updated successfully');
      setIsEditModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      message.error('Failed to update blog');
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
          <h1 className="text-white text-2xl font-bold">Blog</h1>
        </div>
        <button
          onClick={() => showEditModal({})}
          className="flex items-center gap-2 bg-gray-100 text-[#111826] px-4 py-2 rounded-md transition-colors"
        >
          <IoCreateOutline className="w-5 h-5" />
          Create Blog
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 flex justify-end">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            onRow={(record) => ({
              onClick: () => showViewModal(record),
            })}
          />
          {isError && (
            <div className="text-center text-red-600 py-4">
              {error?.data?.message || "Failed to load blogs. Please try again."}
            </div>
          )}
        </ConfigProvider>
      </div>

      {/* View Blog Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoDocumentTextOutline className="w-6 h-6 text-[#111826]" />
            <span>Blog Details</span>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedBlog && (
          <div className="py-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold">{selectedBlog.title}</h3>
                <p className="text-gray-500">By {selectedBlog.author} • {dayjs(selectedBlog.date).format('MMM DD, YYYY')}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedBlog.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedBlog.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Category: {selectedBlog.category}</span>
                <span>•</span>
                <span>Views: {selectedBlog.views ? selectedBlog.views.toLocaleString() : '0'}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h4 className="text-lg font-semibold mb-3">Content Preview</h4>
              <p className="text-gray-700 leading-relaxed">
                {selectedBlog.content}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoCreateOutline className="w-6 h-6 text-[#111826]" />
            <span>Edit Blog</span>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedBlog && (
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedBlog.title}
                  onChange={(e) => setSelectedBlog({...selectedBlog, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={selectedBlog.author}
                  onChange={(e) => setSelectedBlog({...selectedBlog, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={selectedBlog.category}
                  onChange={(e) => setSelectedBlog({...selectedBlog, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={selectedBlog.content}
                  onChange={(e) => setSelectedBlog({...selectedBlog, content: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  if (selectedBlog._id) {
                    handleUpdateBlog(selectedBlog);
                  } else {
                    handleCreateBlog(selectedBlog);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedBlog._id ? 'Save Changes' : 'Create Blog'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Blog Modal */}
      <Modal
        title="Delete Blog"
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
            onClick={handleDeleteBlog}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>,
        ]}
      >
        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to delete the blog "{blogToDelete?.title}"? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Blog;