import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyEmailMutation } from "../../redux/api/authApi";

function VerificationCode() {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const [verifyEmail, { isLoading, error }] = useVerifyEmailMutation();

  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 6) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      alert("Please enter all 6 digits of the verification code");
      return;
    }
    
    try {
      const result = await verifyEmail({ email, otp: verificationCode });
      if (result.data) {
        navigate(`/new-password`);
      }
    } catch (err) {
      console.error("Failed to verify code:", err);
      alert(err.data?.message || "Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex  justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="flex justify-center items-center mb-10">
              <img src="/logo.png" alt="" />
            </div>

             <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }}>
              

              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="shadow-xs w-12 h-12 text-2xl text-center border border-[#6A6D76] text-[#0d0d0d] rounded-lg focus:outline-none"
                  />
                ))}
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error.data?.message || "Invalid verification code"}
                </div>
              )}
            </form>
            <div className="flex justify-center items-center my-5">
              <button
                onClick={handleVerifyCode}
                disabled={isLoading}
                className="w-1/3 bg-[#111826] text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
            <p className="text-[#111826] text-center mb-10">
              You have not received the email?{" "}
              <span className="text-[#111826] cursor-pointer hover:underline"> Resend</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationCode;
