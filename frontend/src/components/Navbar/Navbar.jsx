import React, { useContext, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

function Navbar({ setShowLogin, showLogin }) {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("Email");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to={"/"} className="logo-a">
        <span
          className={`dancing-text ${showLogin ? "blurred-title" : ""}`}
          onClick={() => setMenu("home")}
        >
          Multi Cuisine Food Delivery
        </span>
      </Link>

      <ul className="navbar-menu">
        <Link
          to="/"
          className={menu === "home" ? "active" : ""}
          onClick={() => setMenu("home")}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          className={menu === "menu" ? "active" : ""}
          onClick={() => setMenu("menu")}
        >
          Menu
        </a>
        <a
          href="#app-download"
          className={menu === "mobileapp" ? "active" : ""}
          onClick={() => setMenu("mobileapp")}
        >
          Mobile App
        </a>
        <a
          href="#contact-us"
          className={menu === "contactus" ? "active" : ""}
          onClick={() => setMenu("contactus")}
        >
          Contact Us
        </a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />
        <div className="navbar-search-icon">
          <Link to={"/cart"}>
            <img onClick={() => setMenu("cart")} src={assets.bag_icon} alt="cart" />
          </Link>
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </div>

        {localStorage.getItem("Token") ? (
          <img
            src={assets.profile_icon}
            alt="profile"
            onClick={() => navigate("/myprofile")}
            className="navbar-profile"
          />
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
