import { ConfigProvider, Modal, Table, message } from "antd";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  IoSearch,
  IoChevronBack,
  IoDocumentTextOutline,
  IoTrash,
  IoCreateOutline,
} from "react-icons/io5";
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

  const editorRef = useRef(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [blogToDelete, setBlogToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const editingBlogId =
    isEditModalOpen && selectedBlog?._id ? selectedBlog._id : undefined;

  const { data: singleBlogResponse } = useGetSingleBlogQuery(editingBlogId, {
    skip: !editingBlogId,
    refetchOnMountOrArgChange: true,
  });

  const blogData = blogs?.data || [];
  console.log("Blog API Response:", blogs);
  console.log("Blog Data:", blogData);

  // Monitor blogToDelete state changes
  useEffect(() => {
    console.log("blogToDelete state changed:", blogToDelete);
  }, [blogToDelete]);

  useEffect(() => {
    if (!isEditModalOpen) return;
    if (!editorRef.current) return;
    if (!selectedBlog) return;

    const nextHtml = selectedBlog.body || "";
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [isEditModalOpen, selectedBlog]);

  useEffect(() => {
    if (!isEditModalOpen || !selectedBlog?._id) return;

    const fetchedBlog = singleBlogResponse?.data;
    if (!fetchedBlog) return;

    setSelectedBlog((prev) => {
      if (!prev || prev._id !== fetchedBlog._id) return prev;

      return {
        ...prev,
        ...fetchedBlog,
        author: fetchedBlog.publishedBy || prev.author,
        date: fetchedBlog.publishedDate || prev.date,
        content: fetchedBlog.body || prev.content,
        body: fetchedBlog.body || "",
        image: fetchedBlog.coverImage || fetchedBlog.image || prev.image || "",
      };
    });
  }, [isEditModalOpen, selectedBlog?._id, singleBlogResponse]);

  const dataSource = useMemo(() => {
    return blogData
      .filter(
        (blog) =>
          blog.title &&
          blog.publishedBy &&
          (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.publishedBy.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .map((blog) => ({
        key: blog._id,
        _id: blog._id,
        title: blog.title,
        author: blog.publishedBy,
        category: blog.category || "General",
        date: blog.publishedDate,
        status: blog.status || "Published",
        body: blog.body,
        content: blog.body,
        coverImage: blog.coverImage,
        image: blog.coverImage,
      }));
  }, [blogData, searchTerm]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <div className="font-medium text-gray-900">{text}</div>,
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
        <span className="text-gray-600">
          {dayjs(text).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            text === "Published"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {text}
        </span>
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
      title: "",
      publishedBy: "",
      category: "",
      body: "",
      status: "Draft",
      publishedDate: new Date().toISOString().split("T")[0],
      coverImage: "",
    };
    setSelectedBlog(blog._id ? blog : defaultBlog);
    setIsEditModalOpen(true);
  };

  const showDeleteModal = (blog) => {
    console.log("Blog to delete:", blog);
    console.log("Blog ID:", blog._id);
    setBlogToDelete(blog);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const execEditorCommand = (command, value) => {
    const el = editorRef.current;
    if (!el || !selectedBlog) return;

    el.focus();
    document.execCommand(command, false, value);

    const nextHtml = el.innerHTML;
    setSelectedBlog({ ...selectedBlog, body: nextHtml });
  };

  const handleEditorInput = (e) => {
    if (!selectedBlog) return;
    const nextHtml = e.currentTarget.innerHTML;
    setSelectedBlog({ ...selectedBlog, body: nextHtml });
  };

  const handleDeleteBlog = async () => {
    try {
      console.log("Current blogToDelete state:", blogToDelete);
      console.log("blogToDelete._id:", blogToDelete?._id);

      if (!blogToDelete || !blogToDelete._id) {
        console.error("No blog ID available for deletion");
        message.error("No blog selected for deletion");
        return;
      }

      console.log("Deleting blog with ID:", blogToDelete._id);
      await deleteBlog({ _id: blogToDelete._id }).unwrap();
      message.success("Blog deleted successfully");
      setIsDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete blog");
    }
  };

  const handleCreateBlog = async (blogData) => {
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("body", blogData.body);

      if (blogData.coverImage) {
        formData.append("coverImage", blogData.coverImage);
      }

      // Debug FormData contents
      console.log("Blog Data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await createBlog(formData).unwrap();
      message.success("Blog created successfully");
      setIsEditModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("Create blog error:", error);
      message.error("Failed to create blog");
    }
  };

  const handleUpdateBlog = async (blogData) => {
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("body", blogData.body);

      if (blogData.coverImage) {
        formData.append("coverImage", blogData.coverImage);
      }

      // Debug FormData contents
      console.log("Update Blog Data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await updateBlog({ _id: blogData._id, data: formData }).unwrap();
      message.success("Blog updated successfully");
      setIsEditModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error("Update blog error:", error);
      message.error("Failed to update blog");
    }
  };

  return (
    <div>
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Blog</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => showEditModal({})}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-700"
          >
            <IoCreateOutline className="w-5 h-5" />
            Create Blog
          </button>
          <div className="relative w-64 md:w-80">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
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
                <p className="text-gray-500">
                  By {selectedBlog.author} •{" "}
                  {dayjs(selectedBlog.date).format("MMM DD, YYYY")}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedBlog.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
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
              </div>
            </div>

            <div className="prose max-w-none">
              <h4 className="text-lg font-semibold mb-3">Content Preview</h4>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedBlog.content ||
                    selectedBlog.body ||
                    selectedBlog.description ||
                    "No content available",
                }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <IoCreateOutline className="w-6 h-6 text-[#111826]" />
            <span>{selectedBlog?._id ? "Edit Blog" : "Create Blog"}</span>
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
                  onChange={(e) =>
                    setSelectedBlog({ ...selectedBlog, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                <div className="space-y-2">
                  {selectedBlog.image && (
                    <div className="relative">
                      <img
                        src={selectedBlog.image}
                        alt="Blog featured"
                        className="w-full h-40 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBlog({
                            ...selectedBlog,
                            image: "",
                            coverImage: undefined,
                          })
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSelectedBlog({
                              ...selectedBlog,
                              image: reader.result,
                              coverImage: file, // Store the actual file for API upload
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors text-center text-sm text-gray-600"
                    >
                      {selectedBlog.image ? "Change Image" : "Choose Image"}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a featured image for your blog post (JPG, PNG, GIF)
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Formatting Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center gap-1">
                    <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execEditorCommand("bold")}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Bold"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 4v12h4c1.657 0 3-1.343 3-3s-1.343-3-3-3H6zm2 2h2c.552 0 1 .448 1 1s-.448 1-1 1H8V6zm0 4h2c1.657 0 3 1.343 3 3s-1.343 3-3 3H8v-6z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execEditorCommand("italic")}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Italic"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 2h6v2h-2.5l-2 8H11v2H5v-2h2.5l2-8H9V2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execEditorCommand("underline")}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Underline"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 3h10v2H5V3zm0 12h10v2H5v-2zm1-6h8v2c0 2.21-1.79 4-4 4s-4-1.79-4-4V9z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execEditorCommand("formatBlock", "H2")}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Heading"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 4h14v2H3V4zm0 4h8v2H3V8zm0 4h14v2H3v-2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execEditorCommand("formatBlock", "P")}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Paragraph"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 3h14v2H3V3zm0 4h10v2H3V7zm0 4h14v2H3v-2zm0 4h8v2H3v-2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execEditorCommand("insertUnorderedList")}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Bullet List"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 6h14v2H3V6zm0 4h14v2H3v-2zm0 4h14v2H3v-2zM1 6h2v2H1V6zm0 4h2v2H1v-2zm0 4h2v2H1v-2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => execEditorCommand("insertOrderedList")}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Numbered List"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 6h14v2H3V6zm0 4h14v2H3v-2zm0 4h14v2H3v-2zM1 6h2v2H1V6zm0 4h2v2H1v-2zm0 4h2v2H1v-2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Link"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3.5 13.5c2.5 2.5 6.5 2.5 9 0l2-2c2.5-2.5 2.5-6.5 0-9s-6.5-2.5-9 0l-1 1m6 6l-2-2m2 2l-2 2" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4zm1 2h10v10H5V5zm2 2a1 1 0 000 2h6a1 1 0 100-2H7zm-1 4a1 1 0 00-1 1v1a1 1 0 001 1h8a1 1 0 001-1v-1a1 1 0 00-1-1H6z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Editor */}
                  <div className="relative">
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleEditorInput}
                      className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 text-gray-700 resize-none min-h-[240px]"
                    />

                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow-sm">
                      {selectedBlog.body?.length || 0} characters
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
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
                {selectedBlog._id ? "Save Changes" : "Create Blog"}
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
            Are you sure you want to delete the blog "{blogToDelete?.title}"?
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Blog;
