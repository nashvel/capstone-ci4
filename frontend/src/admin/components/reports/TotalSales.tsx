import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const TotalSales: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [count, setCount] = useState(0);
  const targetNumber = 12500;
  const duration = 1000; // Duration in milliseconds
  const steps = 60; // Number of steps for the animation

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    const stepDuration = duration / steps;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentStep = Math.min(Math.floor(progress / stepDuration), steps);
      const percentage = currentStep / steps;
      
      setCount(Math.floor(percentage * targetNumber));

      if (currentStep < steps) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const data = [
    { value: 1000 },
    { value: 2000 },
    { value: 1500 },
    { value: 2200 },
    { value: 1800 },
    { value: 2500 },
    { value: 3000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: isMobile ? -1 : 0 }}
      animate={{ opacity: 1, y: 0, rotate: isMobile ? 1.5 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "relative",
        padding: isMobile ? "10px" : "16px",
        background: isMobile
          ? "linear-gradient(#ffe4e1 90%, #f3c6c6 100%)"
          : "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: isMobile ? "1px solid #f3c6c6" : "none",
        color: isMobile ? "#5a2d2d" : "black",
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
            background: "#d9534f",
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
              cursor={{ stroke: "#ff758f", strokeWidth: 0.3, strokeDasharray: "4 4" }}
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
              dot={{ fill: "#ff758f", r: 2 }} // Smaller dots
              strokeDasharray="8 4"
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff758f" />
                <stop offset="100%" stopColor="#ff5252" />
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
        Total Sales
      </h3>

      <p
        style={{
          fontSize: isMobile ? "1.2rem" : "1.8rem", // Smaller numbers
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

export default TotalSales;