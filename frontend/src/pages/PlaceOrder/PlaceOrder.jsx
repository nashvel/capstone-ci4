import React, { useContext, useState, useEffect } from "react";
import "./placeOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import gcash_qrcode from "../../assets/gcash_qrcode.jpg";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from "../../components/GoogleMap/GoogleMap";
import axios from "axios";

function PlaceOrder() {
  const { getTotalCartAmount, food_list, cartItems, promoApplied, clearCart } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [codLoading, setCodLoading] = useState(false);
  const [showGcashPopup, setShowGcashPopup] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState(localStorage.getItem("deliveryOption") || "deliver");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("orderData"));
    if (savedData) setData(savedData);

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      axios.post("http://localhost:8080/get-user", { email: userEmail }, { withCredentials: true })

        .then((res) => {
          if (res.data.user) {
            setData((prevData) => ({
              ...prevData,
              name: `${res.data.user.first_name} ${res.data.user.last_name}`,
              email: res.data.user.email,
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, []);

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const getOrderItems = () => {
    return Object.keys(cartItems)
      .filter((id) => cartItems[id] > 0)
      .reduce((acc, id) => {
        const item = food_list.find((food) => food._id === id);
        if (item) acc[item.name] = cartItems[id];
        return acc;
      }, {});
  };

  const locateMe = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const result = await res.json();
          const address = result.display_name;
          setData((prev) => ({ ...prev, address }));
          toast.success("Address auto-filled!");
        } catch (error) {
          toast.error("Failed to fetch address");
        }
      },
      () => {
        toast.error("Location access denied");
      }
    );
  };

  const handleOrder = async (paymentMethod) => {
    if (!data.name || !data.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (orderType === "deliver" && (!data.phone || !data.address)) {
      toast.error("Please enter your phone number and delivery address.");
      return;
    }

    const orderItems = getOrderItems();
    if (Object.keys(orderItems).length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(paymentMethod === "online");
    setCodLoading(paymentMethod === "cod");

    const orderData = {
      name: data.name,
      email: data.email,
      order_type: orderType,
      phone: orderType === "deliver" ? data.phone : null,
      address: orderType === "deliver" ? data.address : "Tagoloan",
      items: orderItems,
      total_price: promoApplied ? getTotalCartAmount() + 5 - 25 : getTotalCartAmount() + 5,
      payment_method: paymentMethod,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));

    try {
      const response = await axios.post("http://localhost:8080/place-order", orderData, { withCredentials: true });
      if (response.status === 200) {
        toast.success("Order placed successfully!");
        clearCart();
        localStorage.removeItem("orderData");
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Order failed! Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setCodLoading(false);
    }
  };

  return (
    <>
      {getTotalCartAmount() > 0 ? (
        <form className="place-order" onSubmit={(e) => e.preventDefault()}>
          <div className="place-order-left">
            <button className="back-btn" onClick={() => navigate("/cart")}>← Back to Cart</button>
            <p className="title">Order Information</p>

            <input required name="name" value={data.name} onChange={onChangeHandler} type="text" placeholder="Full Name" />
            <input required name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Email Address" />

            {orderType === "deliver" ? (
              <>
                <input required name="phone" value={data.phone} onChange={onChangeHandler} type="number" placeholder="Phone Number" />
                <input required name="address" value={data.address} onChange={onChangeHandler} type="text" placeholder="Delivery Address" />
                <button type="button" className="locate-me-btn" onClick={locateMe}>📍 Locate Me</button>
              </>
            ) : (
              <>
                <input required name="address" value="Tagoloan" type="text" placeholder="Pick Up Address" readOnly />
                <button type="button" className="toggle-map-btn" onClick={() => setShowMap(!showMap)}>
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
                {showMap && <GoogleMapComponent orderType={orderType} />}
              </>
            )}
          </div>

          <div className="place-order-right">
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>₱{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Platform Fee</p>
                <p>₱5</p>
              </div>
              {promoApplied && (
                <>
                  <hr />
                  <div className="cart-total-details">
                    <p>Discount</p>
                    <p>- ₱25</p>
                  </div>
                </>
              )}
              <hr />
              <div className="cart-total-details">
                <p>Total</p>
                <p>₱{promoApplied ? getTotalCartAmount() + 5 - 25 : getTotalCartAmount() + 5}</p>
              </div>
              <button className="pay-online" onClick={() => setShowGcashPopup(true)}>
                Pay with GCash <img src={assets.upi} style={{ width: "80px" }} />
              </button>
              <div className="cod">
                <button className="cod-btn pay-online" onClick={() => handleOrder("cod")}>
                  {codLoading ? "Processing..." : orderType === "deliver" ? "Cash On Delivery" : "Pay on Store"}
                </button>
                <p>(This option will place your order).</p>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="empty-cart">
          <img src={assets.empty_cart} alt="empty cart" />
          <h2>Your cart is Empty.</h2>
          <p>Looks like you have not added anything to your cart.</p>
        </div>
      )}

      {showGcashPopup && (
        <div className="gcash-popup">
          <div className="gcash-popup-content">
            <span className="close" onClick={() => setShowGcashPopup(false)}>&times;</span>
            <h2>Scan to Pay with GCash</h2>
            <img src={gcash_qrcode} alt="GCash QR Code" className="gcash-qr" style={{ width: "400px", height: "auto" }} />
            <button className="verify-btn" onClick={() => handleOrder("online")}>Verify Payment</button>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaceOrder;
