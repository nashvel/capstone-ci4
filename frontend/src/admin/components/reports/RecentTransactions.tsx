import React, { useEffect, useState } from "react";

interface Transaction {
  id: string;
  item: string;
  amount: string;
}

const recentTransactions: Transaction[] = [
  { id: "#001", item: "Beef Bulgogi", amount: "₱699" },
  { id: "#002", item: "Kimbap", amount: "₱899" },
  { id: "#003", item: "Kimchi", amount: "₱199" },
];

const RecentTransactions: React.FC = () => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    const element = document.getElementById("recent-transactions");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <div
      id="recent-transactions"
      style={{
        background: "linear-gradient(#fff8dc 90%, #f7e9b8 100%)", // Sticky note color
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05)", // Depth effect
        padding: "16px",
        position: "relative",
        fontFamily: "'Caveat', cursive", // Optional: Handwritten style
        width: "100%",
        maxWidth: "400px",
        minHeight: "180px",
        border: "1px solid #e1c699",
        overflow: "hidden",
        transform: "rotate(2deg)", // Slight tilt for a casual note feel
        opacity: isInView ? 1 : 0, // Fade in when in view
        transition: "opacity 1s ease-in-out", // Smooth fade transition
      }}
    >
      {/* Push Pin Effect (Optional) */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "12px",
          height: "12px",
          background: "red",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* Title */}
      <h3
        style={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginBottom: "8px",
          borderBottom: "2px dashed #b89b66",
          paddingBottom: "4px",
          textAlign: "center",
        }}
      >
        Recent Transactions
      </h3>

      {/* List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {recentTransactions.map((tx, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1rem",
              padding: "6px 0",
              borderBottom: index !== recentTransactions.length - 1 ? "1px dashed #b89b66" : "none",
              opacity: 0,
              animation: isInView
                ? `fadeIn 0.5s ease-in forwards ${index * 0.3}s`
                : "none", // Trigger animation when in view
            }}
          >
            <span>{tx.id}</span>
            <span>{tx.item}</span>
            <span style={{ fontWeight: "bold" }}>{tx.amount}</span>
          </li>
        ))}
      </ul>

      {/* Torn Paper Edge Effect */}
      <div
        style={{
          position: "absolute",
          bottom: "-5px",
          left: "0",
          width: "100%",
          height: "10px",
          background:
            "radial-gradient(circle, rgba(0,0,0,0.2) 10%, transparent 10%)",
          backgroundSize: "10px 10px",
        }}
      />

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default RecentTransactions;
