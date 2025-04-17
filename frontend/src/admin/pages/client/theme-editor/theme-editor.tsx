import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/breadcrums";
import Header from "../../../layouts/header";
import Sidemenu from "../../../layouts/sidemenu";

const ThemeEditor: React.FC = () => {
    // State for colors
    const [sidebarColor, setSidebarColor] = useState("linear-gradient(135deg, #ffffff, #e3f2fd, #e3f2fd)");
    const [headerColor, setHeaderColor] = useState("linear-gradient(135deg, #ffffff, #e3f2fd, #d1c4e9)");
    const [dashboardColor, setDashboardColor] = useState("linear-gradient(135deg, #ffffff, #e3f2fd, #d1c4e9)");
    const [breadcrumbColor, setBreadcrumbColor] = useState("#f0f0f0");
    const [textColor, setTextColor] = useState("#000000"); 

    // Theme modes
    const [theme, setTheme] = useState(localStorage.getItem("themeMode") || "light");

    // Load saved colors from localStorage
    useEffect(() => {
        const savedSidebar = localStorage.getItem("sidebarColor");
        const savedHeader = localStorage.getItem("headerColor");
        const savedDashboard = localStorage.getItem("dashboardColor");
        const savedBreadcrumb = localStorage.getItem("breadcrumbColor");

        if (savedSidebar) setSidebarColor(savedSidebar);
        if (savedHeader) setHeaderColor(savedHeader);
        if (savedDashboard) setDashboardColor(savedDashboard);
        if (savedBreadcrumb) setBreadcrumbColor(savedBreadcrumb);
    }, []);

    // Apply theme mode
    useEffect(() => {
        localStorage.setItem("themeMode", theme);
        switch (theme) {
            case "dark":
                setSidebarColor("#1e1e1e");
                setHeaderColor("#121212");
                setDashboardColor("#181818");
                setBreadcrumbColor("#252525");
                setTextColor("#ffffff"); // White text for dark mode
                break;
            case "minimal":
                setSidebarColor("#f5f5f5");
                setHeaderColor("#ffffff");
                setDashboardColor("#fafafa");
                setBreadcrumbColor("#e0e0e0");
                setTextColor("#000000");
                break;
            case "pink-blush":
                setSidebarColor("#ffdde1");
                setHeaderColor("#ffdde1");
                setDashboardColor("#ffdde1");
                setBreadcrumbColor("#ffccd5");
                setTextColor("#000000");
                break;
            case "corporate-blue":
                setSidebarColor("#0d47a1");
                setHeaderColor("#1565c0");
                setDashboardColor("#1e88e5");
                setBreadcrumbColor("#64b5f6");
                setTextColor("#ffffff");
                break;
            case "elegant-gray":
                setSidebarColor("#4f4f4f");
                setHeaderColor("#333333");
                setDashboardColor("#616161");
                setBreadcrumbColor("#757575");
                setTextColor("#ffffff");
                break;
            case "soft-beige":
                setSidebarColor("#f5ebe0");
                setHeaderColor("#e3d5ca");
                setDashboardColor("#ede0d4");
                setBreadcrumbColor("#d6ccc2");
                setTextColor("#000000");
                break;
            case "professional-navy":
                setSidebarColor("#1b1f3b");
                setHeaderColor("#162447");
                setDashboardColor("#1f4068");
                setBreadcrumbColor("#253b6e");
                setTextColor("#ffffff");
                break;
            case "frosted-glass":
                setSidebarColor("linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(200, 200, 200, 0.6))");
                setHeaderColor("rgba(255, 255, 255, 0.8)");
                setDashboardColor("rgba(245, 245, 245, 0.7)");
                setBreadcrumbColor("rgba(225, 225, 225, 0.6)");
                setTextColor("#000000");
                break;
            default:
                setSidebarColor("linear-gradient(135deg, #ffffff, #e3f2fd, #e3f2fd)");
                setHeaderColor("linear-gradient(135deg, #ffffff, #e3f2fd, #d1c4e9)");
                setDashboardColor("linear-gradient(135deg, #ffffff, #e3f2fd, #d1c4e9)");
                setBreadcrumbColor("#f0f0f0");
                setTextColor("#000000");
        }
    }, [theme]);

    // Apply full-screen background fix
    useEffect(() => {
        document.body.style.background = dashboardColor;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.color = textColor; // Apply text color globally
    }, [dashboardColor, textColor]);

    // Save colors to localStorage
    const saveTheme = () => {
        localStorage.setItem("sidebarColor", sidebarColor);
        localStorage.setItem("headerColor", headerColor);
        localStorage.setItem("dashboardColor", dashboardColor);
        localStorage.setItem("breadcrumbColor", breadcrumbColor);
        alert("Theme saved successfully!");
    };

    // Reset to Default
    const resetTheme = () => {
        setTheme("light");
        setSidebarColor("linear-gradient(135deg, #ffffff, #e3f2fd, #e3f2fd)");
        setHeaderColor("linear-gradient(135deg, #ffffff, #e3f2fd, #d1c4e9)");
        setDashboardColor("linear-gradient(135deg, #ffffff, #e3f2fd, #d1c4e9)");
        setBreadcrumbColor("#f0f0f0");
        setTextColor("#000000");

        localStorage.removeItem("sidebarColor");
        localStorage.removeItem("headerColor");
        localStorage.removeItem("dashboardColor");
        localStorage.removeItem("breadcrumbColor");
    };

    return (
        <>
            {/* Apply custom colors */}
            <Header customStyle={{ background: headerColor, color: textColor }} />
            <Sidemenu customStyle={{ background: sidebarColor, color: textColor }} />

            <div
                className="main-content app-content"
                style={{
                    background: dashboardColor,
                    height: "100vh",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    padding: "20px",
                    color: textColor, // Apply text color globally
                }}
            >
                <div className="container-fluid">
                    <Breadcrumb
                        title="Theme Editor"
                        active="Customize Theme"
                        customStyle={{ background: breadcrumbColor, color: textColor }}
                    />

                    <div className="box p-6 shadow-lg rounded-md"
                        style={{
                            backgroundColor: theme === "dark" ? "#252525" : "#ffffff",
                            color: textColor
                        }}
                    >
                        <h2 className="text-lg font-bold mb-4">Customize Theme</h2>

                        {/* Theme Mode Selector */}
                        <div className="mb-4">
                            <label className="font-semibold block">Select Theme Mode:</label>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {[
                                    "light",
                                    "dark",
                                    "minimal",
                                    "pink-blush",
                                    "corporate-blue",
                                    "elegant-gray",
                                    "soft-beige",
                                    "professional-navy",
                                    "frosted-glass"
                                ].map((themeOption) => (
                                    <button
                                        key={themeOption}
                                        onClick={() => setTheme(themeOption)}
                                        className={`px-4 py-2 rounded ${theme === themeOption ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
                                    >
                                        {themeOption.replace("-", " ").toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button onClick={saveTheme} className="bg-green-500 text-white px-4 py-2 rounded">Save Theme</button>
                            <button onClick={resetTheme} className="bg-gray-500 text-white px-4 py-2 rounded">Reset to Default</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThemeEditor;
