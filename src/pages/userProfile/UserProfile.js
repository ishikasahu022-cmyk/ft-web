import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../api/axiosInstence";
import moment from 'moment';
import { toast } from "react-toastify";

const UserProfile = () => {
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    phoneNumber: "",
    address: "",
    dob: "",
    password: "",
    confirmPassword: "",
    image: null,
    imageFile: null,
  });

  // ----------------------------
  // FETCH PROFILE (GET API)
  // ----------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/user-detail`);
        const data = res.data.data;
        setProfile({
          name: data.name || "",
          email: data.email || "",
          username: data.userName || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          dob: moment(data.dob).format('YYYY-MM-DD') || "",
          password: "",
          confirmPassword: "",
          image: data.image || null,
          imageFile: null,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ----------------------------
  // HANDLE INPUT CHANGE
  // ----------------------------
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ----------------------------
  // FILE PICKER
  // ----------------------------
  const handleFileClick = () => {
    fileRef.current.click();
  };

  // ----------------------------
  // IMAGE CHANGE
  // ----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setProfile({
      ...profile,
      image: URL.createObjectURL(file),
      imageFile: file,
    });
  };

  // ----------------------------
  // SUBMIT FORM (PUT API)
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile.password !== profile.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      let payload = {
        name: profile.name,
        userName: profile.username,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        dob: profile.dob
      }

      if (profile.password) {
        payload.password = profile.password;
      }

      if (profile.imageFile) {
        payload.profileImage = profile.imageFile
      }

      const { data } = await axiosInstance.put(`/update-profile`, payload);

      console.log("Updated:", data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-0">User Profile</h5>
          <small style={{ color: "#6b7280" }}>
            Manage your personal information
          </small>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: "#111827",
            border: "none",
            borderRadius: "8px",
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Form>
        <Row>
          {/* LEFT SIDE - IMAGE */}
          <Col md={3} className="text-center">
            <img
              src={
                profile.image ||
                "https://ui-avatars.com/api/?name=User&background=111827&color=fff"
              }
              alt="profile"
              className="profile-img"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <input
              type="file"
              ref={fileRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
              accept="image/*"
            />

            <Button
              onClick={handleFileClick}
              style={{
                marginTop: "12px",
                background: "#111827",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Change Photo
            </Button>
          </Col>

          {/* RIGHT SIDE - FORM */}
          <Col md={9}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email (Read-only)</Form.Label>
                  <Form.Control value={profile.email} disabled />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />

            <h6>Change Password</h6>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UserProfile;