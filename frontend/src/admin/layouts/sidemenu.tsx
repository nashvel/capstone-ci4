import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../layouts/sidebarcontent";
import '@fortawesome/fontawesome-free/css/all.min.css';

const SIDEBAR_SECTIONS = [
    {
        title: "",
        links: [{ to: "/", icon: "bi-speedometer2", label: "Dashboard" }],
    },
    {
        title: "",
        links: [
            { to: "/foodmenu", icon: "fas fa-hotdog", label: "Food Menu" },
            { to: "/theme", icon: "bi-palette", label: "Themes" },
        ],
    },
    {
        title: "",
        links: [
            { to: "/chat-admin", icon: "bi-chat-dots-fill", label: "Chat to Admin" },
            { to: "/promo", icon: "bi-megaphone-fill", label: "Add Promo" },
            { to: "/sales", icon: "bi-cash-stack", label: "View Sales" },
        ],
    },
];

const Sidemenu: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth <= 768;
            setIsMobile(mobileView);
            if (!mobileView) {
                toggleSidebar();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [toggleSidebar]);

    return (
        <>
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: isMobile ? (isSidebarOpen ? "85%" : "0") : "260px",
                    maxWidth: "300px",
                    background: "linear-gradient(135deg, #ffffff, #f8e1e7, #ffffff)",
                    borderRadius: "0 12px 12px 0",
                    transition: "all 0.3s ease-in-out",
                    boxShadow: isMobile && isSidebarOpen ? "4px 0 15px rgba(0, 0, 0, 0.15)" : "none",
                    zIndex: 1000,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transform: isMobile && !isSidebarOpen ? "translateX(-100%)" : "translateX(0)",
                }}
            >
                <div style={{ 
                    textAlign: "center", 
                    marginBottom: "20px", 
                    padding: isMobile ? "15px 0" : "10px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}>
                    <span
                        style={{
                            fontFamily: "'Dancing Script', cursive",
                            fontSize: isMobile ? "24px" : "22px",
                            fontWeight: "bold",
                            color: "#333",
                            letterSpacing: "1px",
                        }}
                    >
                        Multi Food Cuisine
                    </span>
                </div>

                <nav style={{ overflowY: "auto", flex: 1 }}>
                    <ul style={{ listStyleType: "none", padding: "0", margin: 0 }}>
                        {SIDEBAR_SECTIONS.map((section, index) => (
                            <React.Fragment key={index}>
                                {section.title && (
                                    <li
                                        style={{
                                            fontSize: "12px",
                                            color: "#444",
                                            padding: "18px 10px",
                                            animation: `fadeInLeft 0.5s ease-out ${index * 0.2}s both`,
                                        }}
                                    >
                                        {section.title}
                                    </li>
                                )}
                                {section.links.map((link, linkIndex) => (
                                    <li 
                                        key={linkIndex}
                                        style={{
                                            animation: `fadeInLeft 0.5s ease-out ${(index * 0.2) + (linkIndex * 0.1)}s both`,
                                        }}
                                    >
                                        <Link
                                            to={link.to}
                                            onClick={() => isMobile && toggleSidebar()}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                textDecoration: "none",
                                                color: "#333",
                                                padding: isMobile ? "16px 20px" : "12px",
                                                borderRadius: "8px",
                                                margin: isMobile ? "5px 10px" : "2px 8px",
                                                transition: "all 0.3s ease",
                                                fontSize: isMobile ? "18px" : "16px",
                                                backgroundColor: "rgba(255,255,255,0.5)",
                                                transform: "scale(1)",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "#f5f5f5";
                                                e.currentTarget.style.transform = "scale(1.02)";
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                                                e.currentTarget.style.transform = "scale(1)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            <i
                                                className={link.icon.includes("fa-") ? `fas ${link.icon}` : `bi ${link.icon}`}
                                                style={{ 
                                                    marginRight: "15px", 
                                                    fontSize: isMobile ? "20px" : "18px",
                                                    width: "20px",
                                                    textAlign: "center"
                                                }}
                                            ></i>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </React.Fragment>
                        ))}
                    </ul>
                </nav>

                <style>
                    {`
                    @keyframes fadeInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    `}
                </style>
            </aside>

            {isMobile && isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100vh",
                        background: "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(4px)",
                        zIndex: 999,
                        transition: "opacity 0.3s ease-in-out",
                    }}
                ></div>
            )}
        </>
    );
};

export default Sidemenu;