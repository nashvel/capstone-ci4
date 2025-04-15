import React, { useState, useEffect } from "react";
import "./myprofile.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function MyProfile() {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(assets.profile_icon);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("Name") || "Guest";
    const storedEmail = localStorage.getItem("Email") || "user@example.com";
    const storedPhone = localStorage.getItem("Phone") || "";
    const storedAvatar = localStorage.getItem("Avatar");

    setName(storedName);
    setEmail(storedEmail);
    setPhone(storedPhone);
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      localStorage.setItem("Avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/updateName", {
        email,
        name,
      });

      if (res.data.message === "Name updated successfully") {
        localStorage.setItem("Name", name);
        localStorage.setItem("Phone", phone);
        toast.success("Profile updated!");
        setEditMode(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }

    setUpdateLoading(false);
  };

  return (
    <div className="my-profile-wrapper">
      <button
        className="btn btn-light settings-icon"
        onClick={() => toast.info("Settings coming soon!")}
      >
        <i className="bi bi-gear"></i>
      </button>

      <div className="profile-header">
        <div className="avatar-wrapper">
          <img src={avatar} alt="Avatar" className="avatar-img" />
          {editMode && (
            <label className="edit-overlay">
              📷
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>
        <div className="name-section">
          <h2>{name}</h2>
          <p>{email}</p>
          {!editMode && (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {editMode ? (
        <form className="profile-form" onSubmit={updateUser}>
          <p className="section-title">Contact</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input type="email" disabled placeholder="Email" value={email} />

          <p className="section-title">Address</p>
          <div className="multi-fields-profile">
            <input
              type="text"
              placeholder="Apartment No"
              value={apartmentNo}
              onChange={(e) => setApartmentNo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Locality"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <div className="multi-fields-profile-2">
            <input
              type="text"
              placeholder="Landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="button-wrapper">
            <button type="submit">
              {updateLoading ? "Updating..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-display">
          <p><strong>Phone:</strong> {phone || "Not added"}</p>
          <p><strong>Address:</strong> 
            {apartmentNo || street || area || landmark || city 
              ? `${apartmentNo}, ${street}, ${area}, ${landmark}, ${city}` 
              : "Not added"}
          </p>
          <div className="button-wrapper">
            <button onClick={() => navigate("/myorders")}>My Orders</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      <h4>***Map update coming soon***</h4>
    </div>
  );
}

export default MyProfile;
