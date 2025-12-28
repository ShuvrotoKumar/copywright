import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/authApi";

function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      await resetPassword({
        newPassword,
        confirmPassword,
      }).unwrap();

     
      navigate("/sign-in");
    } catch (err) {
      console.error("Reset password failed:", err);
      
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            
            {/* Logo */}
            <div className="flex justify-center items-center mb-10">
              <img src="/logo.png" alt="Logo" />
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* New Password */}
              <div className="w-full">
                <label className="text-xl text-[#111826] mb-2 font-bold">
                  New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="**********"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 bottom-4 text-[#6A6D76]"
                  >
                    {showNewPassword ? (
                      <IoEyeOffOutline className="w-5 h-5" />
                    ) : (
                      <IoEyeOutline className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="w-full">
                <label className="text-xl text-[#111826] mb-2 font-bold">
                  Confirm New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="**********"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 bottom-4 text-[#6A6D76]"
                  >
                    {showConfirmPassword ? (
                      <IoEyeOffOutline className="w-5 h-5" />
                    ) : (
                      <IoEyeOutline className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

           

              {/* Submit Button */}
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/3 bg-[#111826] text-white font-bold py-3 rounded-lg shadow-lg mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
