import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 2100 },
  { day: "Wed", sales: 800 },
  { day: "Thu", sales: 1600 },
  { day: "Fri", sales: 2500 },
  { day: "Sat", sales: 1900 },
  { day: "Sun", sales: 3000 },
];

const WeeklySalesOverview: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        marginTop: isMobile ? "-130px" : "0px", // Moves the component downward
        padding: isMobile ? "20px" : "16px",
        background: isMobile ? "rgba(255, 255, 255, 0.15)" : "white",
        backdropFilter: isMobile ? "blur(20px)" : "none",
        WebkitBackdropFilter: isMobile ? "blur(20px)" : "none",
        borderRadius: isMobile ? "18px" : "8px",
        boxShadow: isMobile
          ? "0 10px 30px rgba(0, 0, 0, 0.2)"
          : "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: isMobile ? "1px solid rgba(255, 255, 255, 0.25)" : "none",
        color: isMobile ? "rgba(255, 255, 255, 0.95)" : "black",
        textAlign: "center",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "1rem" : "1.25rem",
          fontWeight: isMobile ? 600 : "bold",
          textTransform: isMobile ? "uppercase" : "none",
          letterSpacing: isMobile ? "1px" : "normal",
        }}
      >
        Weekly Sales Overview
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isMobile ? "#d1d9e6" : "#ccc"} />
          <XAxis dataKey="day" stroke={isMobile ? "#ffffff" : "#555"} />
          <YAxis stroke={isMobile ? "#ffffff" : "#555"} />
          <Tooltip contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "10px" }} />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} dot={{ r: 4, fill: "#8884d8" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklySalesOverview;
