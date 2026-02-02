import { useState, useEffect } from "react";
import { useUpdateAdminProfileMutation, useGetAdminProfileQuery2 } from "../../redux/api/profileApi";
import { toast } from "react-hot-toast";

function EditProfile() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: ""
  });

  // Real API hooks
  const { data: profileData, isLoading } = useGetAdminProfileQuery2();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();

  useEffect(() => {
    if (profileData?.data?.admin) {
      setFormData({
        fullname: profileData.data.admin.fullname || "",
        email: profileData.data.admin.email || "",
        mobile: profileData.data.admin.mobile || ""
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        fullname: formData.fullname,
        mobile: formData.mobile
        // Note: email is not sent to API as it's handled on frontend
      }).unwrap();
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.data?.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };
  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl px-4 sm:px-6 md:px-8 py-5 rounded-md border border-gray-200 shadow-sm">
        <p className="text-[#111827] text-center font-bold text-xl sm:text-2xl mb-5">
          Edit Your Profile
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm md:text-base text-[#111827] mb-2 font-semibold block">
              User Name
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              placeholder="Enter full name"
              required
              disabled={isLoading || isUpdating}
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#111827] mb-2 font-semibold block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              placeholder="Enter email"
              disabled={true} // Email is read-only as it's handled on frontend
            />
          </div>

          <div>
            <label className="text-sm md:text-base text-[#0D0D0D] mb-2 font-semibold block">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none placeholder:text-sm md:placeholder:text-base focus:ring-2 focus:ring-[#74AA2E]"
              placeholder="Enter mobile number"
              required
              disabled={isLoading || isUpdating}
            />
          </div>

          <div className="text-center pt-2">
            <button 
              type="submit"
              disabled={isLoading || isUpdating}
              className="bg-[#111826] text-white font-semibold w-full py-3 rounded-lg hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saving..." : "Save & Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
