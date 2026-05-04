import React, { useState } from "react";
import axiosInstance from "../api/axiosInstence";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OtpVerification from "./otp";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showOtpModel, setShowOtpModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/login", {
        email,
        password
      });

      toast.success("Login successful!");
      setShowOtpModel(true);

    } catch (error) {
      const message =
        error?.data?.message || "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (token) => {
    setFormData({ email: "", password: "" });
    localStorage.setItem("token", token);
    window.location.href = "/";
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-left">
            <h4>Finance Tracker</h4>

            <p>Welcome back! Manage your money with clarity and control.</p>

            <div className="auth-features">
              <div>● Track expenses instantly</div>
              <div>● Monthly insights</div>
              <div>● Secure personal data</div>
            </div>

            <div className="auth-tagline">
              Smart finance starts with awareness.
            </div>
          </div>

          <div className="auth-right">
            <h5 className="auth-title">Welcome back</h5>
            <p className="auth-subtitle">
              Sign in to continue tracking your finances
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <label style={{ marginTop: "15px" }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <button className="auth-btn" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="auth-footer">
                Don’t have an account?{" "}
                <span onClick={() => navigate("/register")}>
                  Sign up
                </span>
              </div>
            </form>
          </div>

        </div>
      </div>
      {showOtpModel && (
        <OtpVerification
          email={formData?.email}
          onClose={() => setShowOtpModel(false)}
          handleSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default Login;