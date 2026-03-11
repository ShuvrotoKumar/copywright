import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import { IoChevronBack } from "react-icons/io5";
import { useUpdateAdminAvatarMutation, useGetAdminProfileQuery2 } from "../../redux/api/profileApi";
import { getImageUrl } from "../../config/envConfig";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const navigate = useNavigate();

  const { data: profileData, isLoading: isProfileLoading, isError: isProfileError, error: profileError } = useGetAdminProfileQuery2();
  const admin = profileData?.data?.admin;

  const [profileImage, setProfileImage] = useState("https://avatar.iran.liara.run/public/44");
  const [updateAdminAvatar, { isLoading: isUploadingAvatar, isError: isAvatarError, error: avatarError }] = useUpdateAdminAvatarMutation();

  useEffect(() => {
    if (admin?.avatar) {
      setProfileImage(getImageUrl(admin.avatar));
    }
  }, [admin]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const result = await updateAdminAvatar(formData).unwrap();
      console.log('Avatar uploaded successfully:', result);
      
      // Update the profile image if the API returns a new URL
      if (result?.data?.avatar) {
        setProfileImage(getImageUrl(result.data.avatar));
      } else {
        // Create a temporary preview URL
        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
      }
      
      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      alert('Failed to update profile picture. Please try again.');
    }

    // Reset the file input
    event.target.value = '';
  };

  return (
    <div>
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap md:flex-nowrap items-start md:items-center gap-2 md:gap-3 shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Profile</h1>
        </div>
        <div className="mx-auto flex flex-col justify-center items-center">
          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row justify-center items-center bg-[#111826] mt-5 text-white w-full max-w-3xl mx-auto p-4 md:p-5 gap-4 md:gap-5 rounded-lg">
            <div className="relative">
              <div className="w-[122px] h-[122px] bg-[#111826] rounded-full border-4 border-white shadow-xl flex justify-center items-center">
                {isProfileLoading ? (
                  <div className="h-30 w-32 rounded-full bg-gray-600 animate-pulse" />
                ) : (
                  <img
                    src={profileImage}
                    alt={admin?.fullname || "profile"}
                    className="h-30 w-32 rounded-full"
                  />
                )}
                {/* Upload Icon */}
                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                  <label htmlFor="profilePicUpload" className="cursor-pointer">
                    {isUploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-[#575757] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaCamera className="text-[#575757]" />
                    )}
                  </label>
                  <input 
                    type="file" 
                    id="profilePicUpload" 
                    className="hidden" 
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    disabled={isUploadingAvatar}
                  />
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg sm:text-xl md:text-3xl font-bold">{admin?.fullname || "Shishir"}</p>
              <p className="text-base sm:text-lg font-semibold">{admin?.role ? admin.role.charAt(0).toUpperCase() + admin.role.slice(1) : "Admin"}</p>
            </div>
          </div>

          {/* Tab Navigation Section */}
          {isProfileError && (
            <div className="w-full max-w-3xl mx-auto mb-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {profileError?.data?.message || "Failed to fetch profile"}
              </div>
            </div>
          )}
          {isAvatarError && (
            <div className="w-full max-w-3xl mx-auto mb-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {avatarError?.data?.message || "Failed to update profile picture"}
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 text-sm sm:text-base md:text-xl font-semibold my-4 md:my-5">
            <p
              onClick={() => setActiveTab("editProfile")}
              className={`cursor-pointer px-3 py-1 rounded-md pb-1 ${activeTab === "editProfile"
                  ? "text-[#111827] border-b-2 border-[#111827]"
                  : "text-[#6A6D76]"
                }`}
            >
              Edit Profile
            </p>
            <p
              onClick={() => setActiveTab("changePassword")}
              className={`cursor-pointer px-3 py-1 rounded-md pb-1 ${activeTab === "changePassword"
                  ? "text-[#111827] border-b-2 border-[#111827]"
                  : "text-[#6A6D76]"
                }`}
            >
              Change Password
            </p>
          </div>

          {/* Tab Content Section */}
          <div className="flex justify-center items-center p-4 md:p-5 rounded-md w-full">
            <div className="w-full max-w-3xl">
              {activeTab === "editProfile" && <EditProfile />}
              {activeTab === "changePassword" && <ChangePass />}
            </div>
          </div>
        </div>
    </div>
  );
}

export default ProfilePage;
