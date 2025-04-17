import React, { useState, useEffect } from "react";
import { useSidebar } from "../layouts/sidebarcontent";

const Header: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const { toggleSidebar } = useSidebar(); // Get the sidebar toggle function
    let scrollTimeout: number;

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = window.setTimeout(() => setIsScrolling(false), 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            style={{
                position: "fixed",
                top: "10px",
                left: "50%",
                transform: `translateX(-50%) scale(${isScrolling ? 0.8 : 1})`,
                background: "linear-gradient(135deg, #ffffff, #f8e1e7, #d9e7ff, #fff7db)",
                color: "#fff",
                height: "50px",
                width: "280px",
                borderRadius: "30px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 15px",
                zIndex: 1000,
                transition: "transform 0.3s ease-in-out, box-shadow 0.25s ease-in-out",
                willChange: "transform, box-shadow",
            }}
        >
            {/* Sidebar Toggle */}
            <button onClick={toggleSidebar} style={{ border: "none", background: "transparent", fontSize: "22px" }}>
                ☰
            </button>

            {/* Search Bar */}
            <input
    type="text"
    placeholder="Search..."
    style={{
        background: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
        backdropFilter: "blur(10px)", // Apply blur effect
        border: "none",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "15px",
        outline: "none",
        fontSize: "14px",
        width: "130px",
        transition: "width 0.2s ease-in-out",
    }}
/>


            {/* Profile Icon */}
            <div
                onClick={toggleExpand}
                style={{
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isExpanded ? "#b392ff" : "#fff",
                    fontSize: "22px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out, color 0.2s ease-in-out",
                    transform: isExpanded ? "scale(1.2)" : "scale(1)",
                }}
            >
                O
            </div>
        </header>
    );
};

export default Header;
