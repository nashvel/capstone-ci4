
import React, { useState, useRef, useEffect } from "react";
import "./exploreMenu.css";
import { menu_list } from "../../assets/assets";
import "bootstrap-icons/font/bootstrap-icons.css";

function ExploreMenu({ category, setCategory }) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const foodDisplayRef = useRef(null);

  const handleLocateMe = () => {
    setShowMap(false);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setError("");
        setShowMap(true);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            data.address.state ||
            "Unknown Location";

          setRegion(locationName);
          setAddressInput(`Current Location - ${locationName}`);
          setIsReadOnly(true);
        } catch {
          setRegion("Unknown Location");
          setAddressInput("Current Location - Unknown");
          setIsReadOnly(true);
        }

        setTimeout(() => {
          setShowMap(false);
        }, 10000);
      },
      () => {
        setError("Unable to retrieve your location. Please allow location access.");
      }
    );
  };

  const handleCategoryClick = (selectedCategory) => {
    setCategory((prev) => (prev === selectedCategory ? null : selectedCategory));

    setTimeout(() => {
      if (foodDisplayRef.current) {
        foodDisplayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  // Render elegant golden stars with animations
  const renderStars = () => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <i key={i} className="bi bi-star-fill star-icon animate-star"></i>
      ));
  };

  // Prioritize categories for mobile
  const prioritizedCategories = ["What's New?", "Best Sellers", "Noodles", "Beverages"];
  const sortedMenuList = [...menu_list].sort((a, b) => {
    const aIndex = prioritizedCategories.indexOf(a.menu_name);
    const bIndex = prioritizedCategories.indexOf(b.menu_name);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <>
      <div className="explore-menu" id="explore-menu">
        <div className="address-input-container">
          <div className="input-wrapper">
            <i className="bi bi-geo-alt-fill location-icon"></i>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter your location"
              className="address-input"
              readOnly={isReadOnly}
            />
          </div>
          <button className="locate-me-btn" onClick={handleLocateMe}>
            Locate Me
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {location && (
          <div className={`map-container ${showMap ? "show" : "hide"}`}>
            <iframe
              title="Google Map"
              className="location-map"
              src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        )}

        <hr />

        <h1>Explore Our Exquisite Partners</h1>
        <p className="explore-menu-text">
          Indulge in a fine selection of <strong>authentic Korean & Asian cuisine</strong>. From flavorful noodles to sizzling barbecue, each dish is crafted to perfection. Let your taste buds embark on a culinary journey!
        </p>

        <div className="explore-menu-list">
          {sortedMenuList.map((item, index) => {
            const isUnavailable = item.menu_name === "Demo 2"; // Condition for unavailable

            return (
              <div
                onClick={() => !isUnavailable && handleCategoryClick(item.menu_name)}
                key={index}
                className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""} ${isUnavailable ? "unavailable" : ""}`}
              >
                <img src={item.menu_image} alt="menu_image" className={`menu-image ${isUnavailable ? "bw-image" : ""}`} />

                <div className="restaurant-details">
                  <p><i className="bi bi-geo-alt-fill"></i> Location: Tagoloan</p>
                  <p><i className="bi bi-basket-fill"></i> Korean Foods</p>
                  <p><i className="bi bi-truck"></i> Free for First Order</p>
                </div>

                {!isUnavailable && <div className="rating">{renderStars()}</div>}
                <p className="menu-title">{item.menu_name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div ref={foodDisplayRef}></div>
    </>
  );
}

export default ExploreMenu;