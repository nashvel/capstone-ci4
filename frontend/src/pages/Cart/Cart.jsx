import React, { useContext, useEffect, useState } from "react";
import "./cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../../components/LoginPopup/LoginPopup";

function Cart() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    cartItems,
    food_list,
    addToCart,
    removeFromCart,
    removeAllFromCart,
    getTotalCartAmount,
    promoApplied,
    applyPromoC,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [validPromo, setValidPromo] = useState("");
  const [deliveryOption, setDeliveryOption] = useState(
    localStorage.getItem("deliveryOption") || "deliver"
  );

  const [showLogin, setShowLogin] = useState(false);
  const isLoggedIn = !!localStorage.getItem("Token"); 

  const DELIVERY_FEE = 25;
  const PLATFORM_FEE = 5;

  const checkPromoCode = () => {
    if (promo === "APEX" && getTotalCartAmount() >= 150) {
      setValidPromo("Promo code applied successfully!");
      applyPromoC(true);
    } else {
      setValidPromo(
        promo === "APEX"
          ? "Cart value must be more than ₱150 to avail this offer!"
          : "Invalid Promo code."
      );
      applyPromoC(false);
    }
  };

  useEffect(() => {
    checkPromoCode();
  }, [cartItems, promo, getTotalCartAmount]);

  useEffect(() => {
    localStorage.setItem("deliveryOption", deliveryOption);
  }, [deliveryOption]);

  const applyPromo = () => {
    checkPromoCode();
  };

  const [shakeButton, setShakeButton] = useState(false);

  useEffect(() => {
    if (shakeButton) {
      const timer = setTimeout(() => setShakeButton(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shakeButton]);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      setShakeButton(false);
      setTimeout(() => setShakeButton(true), 10);
      setTimeout(() => setShakeButton(false), 500);
      return;
    }
  
    const orderedItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: cartItems[item._id],
      }));
  
    const extraFees = deliveryOption === "deliver" ? DELIVERY_FEE + PLATFORM_FEE : 0;
  
    const orderData = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      items: orderedItems,
      total: (getTotalCartAmount() || 0) + extraFees - (promoApplied ? 25 : 0),
      status: "Pending",
      email: "", // Email will be added later in PlaceOrder
    };
  
    // Store the current order in localStorage before navigating
    localStorage.setItem("currentOrder", JSON.stringify(orderData));
  
    navigate("/order"); // Redirect to PlaceOrder
  };
  
  const extraFees = deliveryOption === "deliver" ? DELIVERY_FEE + PLATFORM_FEE : 0;

  return (
    <>
      {getTotalCartAmount() > 0 ? (
        <div className="cart">
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />
            <hr />
            {food_list.map((item) =>
              cartItems[item._id] > 0 ? (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.image} alt="product" />
                    <p>{item.name}</p>
                    <p>₱{item.price}</p>

                    {/* Quantity Control Buttons */}
                    <div className="quantity-controls">
                      <p>{cartItems[item._id]}</p>
                      <div className="quantity-buttons">
                        <button onClick={() => addToCart(item._id)}>+</button>
                        <button onClick={() => removeFromCart(item._id)}>-</button>
                      </div>
                    </div>

                    <p>₱{item.price * cartItems[item._id]}</p>
                    <p onClick={() => removeAllFromCart(item._id)} className="cross">
                      x
                    </p>
                  </div>
                  <hr />
                </div>
              ) : null
            )}
          </div>

          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div>
                <div className="cart-total-details">
                  <p>Total</p>
                  <p>₱{(getTotalCartAmount() || 0) + extraFees - (promoApplied ? 25 : 0)}</p>
                </div>
                <hr />

{/* Delivery Option */}
<div className="cart-total-details">
  <p>Order Type</p>
  <div className="radio-options">
    <label>
      <input
        type="radio"
        name="deliveryOption"
        value="deliver"
        checked={deliveryOption === "deliver"}
        onChange={(e) => setDeliveryOption(e.target.value)}
      />
      Deliver
    </label>
    <label>
      <input
        type="radio"
        name="deliveryOption"
        value="pickup"
        checked={deliveryOption === "pickup"}
        onChange={(e) => setDeliveryOption(e.target.value)}
      />
      Pick Up
    </label>
  </div>
</div>
<hr />

                {promoApplied && getTotalCartAmount() >= 150 && (
                  <>
                    <div className="cart-total-details">
                      <p>Discount</p>
                      <p>- ₱25</p>
                    </div>
                    <hr />
                  </>
                )}

                {/* Checkout Button with Shake Effect */}
                <button
                  onClick={handleCheckout}
                  disabled={!isLoggedIn}
                  className={`checkout-btn ${shakeButton ? "shake" : ""}`}
                >
                  {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
                </button>
              </div>
            </div>

            <div className="cart-promocode">
              <p>If you have a promo code, enter it here.</p>
              <div className="cart-promocode-input">
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="ENTER OUR TEAM NAME"
                />
                <button onClick={applyPromo}>Submit</button>
              </div>
              <p>{validPromo}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <img src={assets.empty_cart} alt="Empty Cart" />
          <h2>Your cart is Empty.</h2>
          <p>Looks like you have not added anything to your cart. Go ahead and explore top categories.</p>
        </div>
      )}

      {/* Show Login Popup if Not Logged In */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
    </>
  );
}

export default Cart;
