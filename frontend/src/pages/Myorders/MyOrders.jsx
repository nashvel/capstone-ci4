import React, { useContext, useEffect, useState } from "react";
import "./myOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyOrders() {
  const { food_list } = useContext(StoreContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const clearOrders = () => {
    localStorage.removeItem("orders"); // Clear orders from localStorage
    setOrders([]); // Update state
    toast.warn("All orders cleared!", { autoClose: 1000 }); // Show toast notification
  };

  return (
    <div className="my-orders">
      <h1>My Orders</h1>

      {/* Clear Orders Button */}
      {orders.length > 0 && (
        <button className="clear-orders-btn" onClick={clearOrders}>
          Clear Orders
        </button>
      )}

      <div className="container">
        {orders.length > 0 ? (
          orders.map((order) => {
            if (!order.items || !Array.isArray(order.items)) return null;

            return (
              <div key={order.id} className="my-orders-order">
                <div className="order-header">
                  <p><b>Order ID:</b> #{order.id}</p>
                  <p><b>Date:</b> {order.date}</p>
                  <p><b>Status:</b> <span>{order.status}</span></p>
                  <p><b>Total:</b> ₱{order.total}</p>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <p>{item.name}</p>
                      <p>₱{item.price}</p>
                      <p>{item.quantity}</p>
                      <p>₱{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate(`/order/${order.id}`)}>
                  View Details
                </button>
              </div>
            );
          })
        ) : (
          <div className="my-order-signout">
            <img src={assets.empty_cart} alt="No Orders" />
            <p>You have no orders yet.</p>
            <p>Start shopping to see your orders here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
