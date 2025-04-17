import React, { useEffect, useRef } from "react";

interface Item {
  name: string;
  sales: number;
}

const bestSellingItems: Item[] = [
  { name: "Kimchi", sales: 120 },
  { name: "Jjangmyeon", sales: 95 },
  { name: "Kimbap", sales: 80 },
];

const BestSellingItems: React.FC = () => {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemRefs.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(#fff8dc 90%, #f7e9b8 100%)",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05)",
        padding: "16px",
        position: "relative",
        fontFamily: "'Caveat', cursive",
        width: "100%",
        maxWidth: "400px",
        minHeight: "180px",
        border: "1px solid #e1c699",
        overflow: "hidden",
        transform: "rotate(-2deg)",
      }}
    >
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
        Best-Selling Items
      </h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {bestSellingItems.map((item, index) => (
          <li
            key={index}
            ref={(el: HTMLLIElement | null): void => {
              itemRefs.current[index] = el;
            }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1rem",
              padding: "6px 0",
              borderBottom: index !== bestSellingItems.length - 1 ? "1px dashed #b89b66" : "none",
              opacity: 0,
              transform: "translateY(20px)",
              transition: `opacity 0.5s ease-in, transform 0.5s ease-in ${index * 0.3}s`,
            }}
            className="fade-in-item"
          >
            <span>{item.name}</span>
            <span style={{ fontWeight: "bold" }}>{item.sales} sold</span>
          </li>
        ))}
      </ul>

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
          .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        `}
      </style>
    </div>
  );
};

export default BestSellingItems;