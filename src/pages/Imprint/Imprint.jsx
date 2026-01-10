import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoChevronBack } from "react-icons/io5";
import { useGetImprintQuery, useUpdateImprintMutation } from "../../redux/api/imprintApi";

export default function Imprint() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetImprintQuery();
  const [updateImprint, { isLoading: isUpdating }] = useUpdateImprintMutation();

  useEffect(() => {
    if (data) {
      setContent(data.data?.content || "");
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      await updateImprint({ requestData: { content } }).unwrap();
      alert("Imprint updated successfully!");
    } catch (err) {
      console.error("Failed to update imprint:", err);
      alert("Failed to update imprint.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

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
        <h1 className="text-white text-2xl font-bold">Imprint</h1>
      </div>

      <div className=" bg-white rounded shadow p-5 h-full">
        <ReactQuill
          style={{ padding: "10px" }}
          theme="snow"
          value={content}
          onChange={setContent}
        />
      </div>
      <div className="text-center py-5 w-full">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-[#111826] text-white font-semibold w-full py-2 rounded transition duration-200 disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}


