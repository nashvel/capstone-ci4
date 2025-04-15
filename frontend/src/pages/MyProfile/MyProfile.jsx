import React, { useState, useEffect } from "react";
import "./myprofile.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"; // Import axios

function MyProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("Guest");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("");
  const [apartmentNo, setApartmentNo] = useState("A-101");
  const [area, setArea] = useState("Downtown");
  const [street, setStreet] = useState("Main St.");
  const [city, setCity] = useState("Metro City");
  const [landmark, setLandmark] = useState("Near Mall");

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("Name");
    const storedEmail = localStorage.getItem("Email");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/updateName", // Your backend endpoint
        {
          email: email,
          name: name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.message === "Name updated successfully") {
        // If name update is successful, update the local storage
        localStorage.setItem("Name", name);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }

      setUpdateLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while updating the profile.");
      setUpdateLoading(false);
    }
  };

  return (
    <div className="my-profile-wrapper">
      <div className="profile-inputs">
        <img src={assets.profile_icon} alt="Profile" width="40px" />
        <form onSubmit={updateUser}>
          <p>Account details</p>
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

          <p>Address</p>
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
          <div className="multi-fields-profile multi-fields-profile-2">
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
              {updateLoading ? "Updating..." : "Update"}
            </button>
            <button type="button" onClick={() => navigate("/myorders")}>
              My Orders
            </button>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
          <h4>***map update coming soon***</h4>
        </form>
      </div>
    </div>
  );
}

export default MyProfile;
