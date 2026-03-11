import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoChevronBack } from "react-icons/io5";
import { useGetPrivacyQuery, useUpdatePrivacyMutation } from "../../redux/api/privacyApi";

export default function PrivacyPolicy() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetPrivacyQuery();
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();

  useEffect(() => {
    if (data) {
      setContent(data.data?.content || "");
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      await updatePrivacy({ requestData: { content } }).unwrap();
      alert("Privacy Policy updated successfully!");
    } catch (err) {
      console.error("Failed to update privacy policy:", err);
      alert("Failed to update privacy policy.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex items-center gap-3 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:opacity-90 transition"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl sm:text-2xl font-bold">Privacy Policy</h1>
      </div>

      <div className="bg-white rounded-md shadow border border-gray-200 p-5">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: "400px", marginBottom: "50px" }}
        />
      </div>
      <div className="text-center py-5 w-full">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-[#111826] text-white font-semibold w-full py-3 rounded-md transition duration-200 disabled:opacity-50 hover:bg-gray-800"
        >
          {isUpdating ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}


