import React, { useState, useRef } from "react";
import axiosInstance from "../api/axiosInstence";
import { toast } from "react-toastify";

const OtpVerification = ({ email, handleSuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  // Handle single digit input
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // move next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ✅ Paste full OTP support
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .trim()
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = pastedData.split("");
    const filledOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      filledOtp[i] = newOtp[i] || "";
    }

    setOtp(filledOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/verifyOtp", {
        email: email,
        otp: finalOtp
      });

      handleSuccess(res.data.token)
      toast.success("OTP verified successfully!");

      setOtp(new Array(6).fill(""));
    } catch (error) {
      console.error(error);
      const message =
        error?.data?.message || "OTP verification failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await axiosInstance.post("/resend-otp");
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h5 className="fw-semibold mb-1">Verify your account</h5>
          <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
            Enter the 6-digit OTP sent to your email
          </p>

          <form onSubmit={handleSubmit}>
            {/* OTP INPUTS */}
            <div className="d-flex justify-content-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className="form-control text-center"
                  style={{
                    width: "45px",
                    height: "50px",
                    borderRadius: "10px",
                    fontSize: "18px",
                    fontWeight: "bold"
                  }}
                />
              ))}
            </div>

            {/* VERIFY BUTTON */}
            <button
              className="btn w-100"
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#111827",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                fontWeight: 500
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND */}
            <p
              className="text-center mt-3 text-muted"
              style={{ fontSize: "13px" }}
            >
              Didn’t receive OTP?{" "}
              <span
                style={{ color: "#111827", cursor: "pointer" }}
                onClick={handleResend}
              >
                Resend
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;