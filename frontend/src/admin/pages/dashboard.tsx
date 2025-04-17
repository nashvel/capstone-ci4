import { useState, useEffect } from "react";
import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import TotalSales from "../components/reports/TotalSales";
import Transactions from "../components/reports/Transactions";
import Revenue from "../components/reports/Revenue";
import WeeklySalesOverview from "../components/reports/WeeklySalesOverview"; 
import BestSellingItems from "../components/reports/BestSelling";
import RecentTransactions from "../components/reports/RecentTransactions";
import React from "react";

function Dashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // Store event
  const [showInstallButton, setShowInstallButton] = useState(false); // Toggle button visibility

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Listen for the "beforeinstallprompt" event
    window.addEventListener("beforeinstallprompt", (e: any) => {
      // Remove preventDefault to allow the banner to show
      setDeferredPrompt(e); // Save the event to trigger later
      setShowInstallButton(true); // Show the install button
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle Manual Install
  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show prompt

      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("[PWA] User accepted the install prompt");
        } else {
          console.log("[PWA] User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Reset
        setShowInstallButton(false); // Hide the install button after prompt
      });
    }
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div
        className="main-content app-content"
        style={{
          background: "linear-gradient(135deg, #f8e1e7, #ffffff, #f8e1e7, #d9e7ff, #fff7db)",
          minHeight: "100vh",
          padding: isMobile ? "10px" : "30px",
          marginTop: "0",
          paddingTop: "0",
        }}
      >
        <div className="container-fluid">
          <Breadcrumb />

          {/* Install Button Only Shown if Prompt Available */}
          {showInstallButton && (
            <button
              onClick={handleInstall}
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                padding: "10px 20px",
                backgroundColor: "#f8e1e7",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              Install App
            </button>
          )}

          {/* Summary Cards */}
          <div
            className="grid gap-4 mt-4"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            }}
          >
            <TotalSales />
            <Transactions />
            <Revenue />
          </div>

          {/* Sales Graph */}
          <WeeklySalesOverview />

          {/* Best-Selling Items & Recent Transactions */}
          <div
            className="grid gap-4 mt-6"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            }}
          >
            <BestSellingItems />
            <RecentTransactions />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;