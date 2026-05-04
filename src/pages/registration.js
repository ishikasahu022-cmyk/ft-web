import React, { useState } from "react";
import axiosInstance from "../api/axiosInstence";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      name,
      email,
      password
    };

    try {
      setLoading(true);

      const res = await axiosInstance.post("/register", payload);

      console.log("Response:", res.data);
      toast.success("Registration successful!");

      // reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      // ✅ redirect to login page after successful registration
      navigate("/login");

    } catch (error) {
      console.error(error);

      const message =
        error?.data?.message || "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">

      <div className="auth-left">
        <h4>Finance Tracker</h4>

        <p>Manage your money with clarity, structure, and control.</p>

        <div className="auth-features">
          <div>● Track expenses instantly</div>
          <div>● Monthly insights</div>
          <div>● Secure personal data</div>
        </div>

        <div className="auth-tagline">
          Built for simple financial control.
        </div>
      </div>

      <div className="auth-right">
        <h5 className="auth-title">Create your account</h5>
        <p className="auth-subtitle">
          Start tracking your finances in minutes
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label style={{ marginTop: "15px" }}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="auth-row">
            <div style={{ flex: 1 }}>
              <label style={{ marginTop: "15px" }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ marginTop: "15px" }}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="auth-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Sign in
            </span>
          </div>
        </form>
      </div>

    </div>
  </div>
);
};

export default Register;