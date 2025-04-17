import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { motion, animate } from "framer-motion";

const Transactions: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const animation = animate(0, 320, {
      duration: 2,
      onUpdate: (latest) => {
        setCount(Math.round(latest));
      },
    });

    return animation.stop;
  }, []);

  const data = [
    { value: 50 },
    { value: 90 },
    { value: 120 },
    { value: 150 },
    { value: 180 },
    { value: 300 },
    { value: 320 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: isMobile ? -1 : 0 }}
      animate={{ opacity: 1, x: 180, y: -100, rotate: isMobile ? 1.5 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "relative",
        padding: isMobile ? "10px" : "16px",
        background: isMobile
          ? "linear-gradient(#cce7ff 90%, #a8d5ff 100%)" // Light blue sticky note 💙
          : "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: isMobile ? "1px solid #a8d5ff" : "none",
        color: isMobile ? "#264d73" : "black",
        textAlign: "center",
        overflow: "hidden",
        transform: isMobile ? "rotate(1.5deg)" : "none",
        width: isMobile ? "160px" : "auto", // Smaller width for mobile
      }}
    >
      {isMobile && (
        <div
          style={{
            position: "absolute",
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "8px",
            height: "8px",
            background: "#1976D2",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}

      {/* Smaller Chart */}
      <div
        style={{
          width: "100%",
          height: isMobile ? "90px" : "100px", // Compact height for mobile
          position: "relative",
          zIndex: 0,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              cursor={{ stroke: "#2196F3", strokeWidth: 0.3, strokeDasharray: "4 4" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "5px",
                fontSize: "10px", // Smaller tooltip font
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#gradientStroke)"
              strokeWidth={2}
              dot={{ fill: "#2196F3", r: 2 }} // Smaller dots
              strokeDasharray="8 4"
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2196F3" />
                <stop offset="100%" stopColor="#1976D2" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3
        style={{
          fontSize: isMobile ? "0.9rem" : "1.2rem", // Smaller font
          fontWeight: "bold",
          marginBottom: "5px",
          textAlign: "center",
        }}
      >
        Transactions
      </h3>

      <p
        style={{
          fontSize: isMobile ? "1.2rem" : "1.8rem", // Smaller numbers
          fontWeight: "800",
          textShadow: isMobile ? "0px 2px 5px rgba(0, 0, 0, 0.3)" : "none",
          opacity: 1,
        }}
      >
        {count}
      </p>

      {isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "0",
            width: "100%",
            height: "8px",
            background:
              "radial-gradient(circle, rgba(0,0,0,0.2) 10%, transparent 10%)",
            backgroundSize: "8px 8px",
          }}
        />
      )}
    </motion.div>
  );
};

export default Transactions;