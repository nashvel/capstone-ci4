import React, { useState, useEffect } from "react";
import "./myprofile.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import girl from "../../assets/avatars/girl.jpg";
import girl2 from "../../assets/avatars/girl2.jpg";
import boy from "../../assets/avatars/boy.png";
import boy1 from "../../assets/avatars/boy1.jpg";

function MyProfile() {
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(assets.profile_icon);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    setFirstName(localStorage.getItem("userFirstName") || "Guest");
    setLastName(localStorage.getItem("userLastName") || "");
    setEmail(localStorage.getItem("Email") || "user@example.com");
    setPhone(localStorage.getItem("Phone") || "");
    const storedAvatar = localStorage.getItem("Avatar");
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
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setAvatar(base64Image);
      localStorage.setItem("Avatar", base64Image);
      console.log("Sending avatar:", base64Image);
  
      try {
        await axios.post(
          "http://localhost:8080/updateAvatar",
          {
            email,
            avatar: base64Image,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        toast.success("Avatar updated successfully!");
      } catch (err) {
        toast.error("Failed to update avatar");
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };
  

  const updateUser = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
  
    try {
      const res = await axios.post(
        "http://localhost:8080/updateName",
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (res.data.message === "Name updated successfully") {
        localStorage.setItem("userFirstName", firstName);
        localStorage.setItem("userLastName", lastName);
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
            <button
              className="btn btn-sm btn-outline-primary"
              style={{ marginTop: "60px" }}
              onClick={() => setShowAvatarModal(true)}
            >
              Change Avatar
            </button>
          )}
        </div>
        <div className="name-section">
          <h2>{`${firstName} ${lastName}`}</h2>
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
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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

      {showAvatarModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose Your Avatar</h5>
                <button type="button" className="btn-close" onClick={() => setShowAvatarModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p className="select-label">Pick one or upload your own:</p>
                <div className="avatar-options mb-3">
                  {[girl, girl2, boy, boy1].map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`avatar-${index}`}
                      className={`avatar-option ${avatar === img ? "selected" : ""}`}
                      onClick={() => {
                        setAvatar(img);
                        localStorage.setItem("Avatar", img);
                        setShowAvatarModal(false);
                      }}
                    />
                  ))}
                </div>
                <div className="upload-wrapper">
                  <label className="btn btn-outline-secondary">
                    Upload Avatar
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        handleAvatarChange(e);
                        setShowAvatarModal(false);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
