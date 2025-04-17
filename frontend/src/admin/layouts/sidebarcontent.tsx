import React, { createContext, useContext, useState } from "react";

interface SidebarContextProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

// Create Context
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

// Provider Component
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

// Custom Hook
export const useSidebar = (): SidebarContextProps => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
