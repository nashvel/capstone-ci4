import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { motion, animate } from "framer-motion";

const Revenue: React.FC = () => {
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
    const animation = animate(0, 18200, {
      duration: 2,
      onUpdate: (latest) => {
        setCount(Math.floor(latest));
      },
    });

    return animation.stop;
  }, []);

  const data = [
    { value: 10000 },
    { value: 12500 },
    { value: 14500 },
    { value: 16000 },
    { value: 17200 },
    { value: 18000 },
    { value: 18200 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: isMobile ? 1 : 0 }}
      animate={{ opacity: 1, y: -150, rotate: isMobile ? -1.5 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "relative",
        padding: isMobile ? "10px" : "16px",
        background: isMobile
          ? "linear-gradient(#e6f9e6 90%, #bdecb6 100%)" // Light green sticky note 🍃
          : "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: isMobile ? "1px solid #bdecb6" : "none",
        color: isMobile ? "#2e4c2e" : "black",
        textAlign: "center",
        overflow: "hidden",
        transform: isMobile ? "rotate(-1.5deg)" : "none",
        width: isMobile ? "160px" : "auto",
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
            background: "#4caf50",
            borderRadius: "50%",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}

      {/* Smaller Chart */}
      <div
        style={{
          width: "100%",
          height: isMobile ? "90px" : "100px",
          position: "relative",
          zIndex: 0,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip
              cursor={{ stroke: "#4caf50", strokeWidth: 0.3, strokeDasharray: "4 4" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "5px",
                fontSize: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#greenGradient)"
              strokeWidth={2}
              dot={{ fill: "#4caf50", r: 2 }}
              strokeDasharray="8 4"
            />
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#66bb6a" />
                <stop offset="100%" stopColor="#2e7d32" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3
        style={{
          fontSize: isMobile ? "0.9rem" : "1.2rem",
          fontWeight: "bold",
          marginBottom: "5px",
          textAlign: "center",
        }}
      >
        Revenue
      </h3>

      <p
        style={{
          fontSize: isMobile ? "1.2rem" : "1.8rem",
          fontWeight: "800",
          textShadow: isMobile ? "0px 2px 5px rgba(0, 0, 0, 0.3)" : "none",
          opacity: 1,
        }}
      >
        ₱{count.toLocaleString()}
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

export default Revenue;