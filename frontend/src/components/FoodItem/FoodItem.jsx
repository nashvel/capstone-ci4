import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./foodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { BiCart } from "react-icons/bi"; // Import cart icon

function FoodItem({ id, name, price, description, image, category, available }) {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isDancing, setIsDancing] = useState(false);

  // Check if there are any items in the cart
  const hasItemsInCart = Object.values(cartItems).some((count) => count > 0);

  // Trigger dance animation when items are added
  useEffect(() => {
    if (hasItemsInCart) {
      setIsDancing(true);
      setTimeout(() => setIsDancing(false), 15000); // Stop dancing after 1s
    }
  }, [cartItems]);

  if (!id) {
    console.warn("FoodItem is missing an ID:", { name, category });
    return null;
  }

  return (
    <div className={`food-item ${available ? "" : "unavailable"}`}>
      <div className="food-item-img-container">
        {!available && (
          <div className="item-unavailable-wrapper">
            <p className="item-unavailable">Sorry, this item is currently unavailable</p>
          </div>
        )}
        <img className="food-item-image" src={image || assets.placeholder} alt={name} />

        {!cartItems[id] ? (
          <img
            src={assets.add_icon_white}
            className="add"
            onClick={() => addToCart(id)}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img className="remove-icon" onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
            <p>{cartItems[id]}</p>
            <img className="add-icon" onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-price-rating-wrapper">
          <p className="food-item-price">₱{price}</p>
          <p className="bubble">{category}</p>
        </div>
      </div>

      {/* Dancing Cart Icon - Only shows when items are in cart */}
      {hasItemsInCart && (
        <button
        className={`cart-icon-btn ${isDancing ? "dancing" : ""}`}
        onClick={() => {
          window.scrollTo(0, 0); // Scroll to top
          setTimeout(() => navigate("/cart"), 50); // Delay navigation slightly
        }}
      >
        <BiCart className="cart-icon" />
      </button>
      
      )}
    </div>
  );
}

export default FoodItem;
